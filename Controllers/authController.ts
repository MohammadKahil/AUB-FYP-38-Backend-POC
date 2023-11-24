import { Secret, sign, verify } from "jsonwebtoken";
import { Request, Response } from "express";
import { compare, hash } from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// @desc Login
// @route POST /auth
// @access Public
export async function login(req: Request, res: Response) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const foundUser = await prisma.user.findUnique({
      where: { email: username },
    });
    if (!foundUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const match = await compare(password, foundUser.password || "");

    if (!match) return res.status(401).json({ message: "Unauthorized" });
    const accessToken = sign(
      {
        UserInfo: {
          username: foundUser.email,
          roles: foundUser.role,
        },
      },
      process.env.ACCESS_TOKEN_SECRET as Secret,
      { expiresIn: "15m" }
    );
    const refreshToken = sign(
      { username: foundUser.email },
      process.env.REFRESH_TOKEN_SECRET as Secret,
      { expiresIn: "7d" }
    );

    // Create secure cookie with refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true, //accessible only by web server
      secure: true, //https
      sameSite: "none", //cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
    });

    // Send accessToken containing username and roles
    res.status(200).json({ accessToken });
  } catch (e) {
    res.status(500).json({
      error: "Internal Server Error",
      message: "Somethin went seriously wrong",
    });
  }
}

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
export async function refresh(req: Request, res: Response) {
  try {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

    const refreshToken = cookies.jwt;

    verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as Secret,
      async (err: any, decoded: any) => {
        if (err) return res.status(403).json({ message: "Forbidden" });
        const foundUser = await prisma.user.findUnique({
          where: { email: decoded.username },
        });
        if (!foundUser)
          return res.status(401).json({ message: "Unauthorized" });

        const accessToken = sign(
          {
            UserInfo: {
              username: foundUser.email,
              roles: foundUser.role,
            },
          },
          process.env.ACCESS_TOKEN_SECRET as Secret,
          { expiresIn: "15m" }
        );

        res.json({ accessToken });
      }
    );
  } catch {
    res.status(500).json({
      error: "Internal Server Error",
      message: "Somethin went seriously wrong",
    });
  }
}

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
export const logout = (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
  res.json({ message: "Cookie cleared" });
};

export async function signup(req: Request, res: Response) {
  try {
    const createdUser = await prisma.user.create({ data: req.body });
    const registrationCode = createdUser.registrationCode;
    // Send accessToken containing username and roles
    res.status(201).json({ registrationCode });
  } catch (exception: any) {
    if (exception.code === "P2002") {
      res.status(409).json({
        error: "Conflict",
        message: `The following attribute must be unique: ${exception.meta.target}`,
      });
    } else if (exception.code === "P2020") {
      res.status(400).json({
        error: "Bad Request",
        message: "sSN or phoneNumber out of range",
      });
    } else {
      res.status(500).json({ exception });
    }
  }
}
export async function register(req: Request, res: Response) {
  try {
    const foundUser = await prisma.user.findMany({
      where: { registrationCode: String(req.body.registrationCode) },
    });
    if (foundUser.length > 0 && foundUser[0].registered === false) {
      const hashedPass = await hash(req.body.password, 10);
      await prisma.user.update({
        where: { id: foundUser[0].id },
        data: { registered: true, password: hashedPass || "" },
      });
      // Send accessToken containing username and roles
      const created = foundUser[0];
      res.status(200).json({ created });
    } else {
      res
        .status(400)
        .json({ error: "Bad Request", message: "Invalid Registration Code" });
    }
  } catch (exception) {
    res.status(500).json({
      error: "Internal Server Error",
      message: "Somethin went seriously wrong",
    });
  }
}
