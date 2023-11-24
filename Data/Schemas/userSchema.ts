const yup = require("yup");

export const AddUserSchema = yup.object({
    body: yup.object({
        firstName: yup.string().min(1).required(),
        middleName: yup.string().min(1).required(),
        lastName: yup.string().min(1).required(),
        sSN: yup.number().required(),
        phoneNumber: yup.number().required(),
        email: yup.string().email().required(),
        address: yup.string().required(),
        extraNotes: yup.string().required(),
        role: yup.mixed().oneOf(["admin","user"]),

    }),
  });

  export const RegisterUserSchema = yup.object({
    body: yup.object({
        registrationCode: yup.string().min(1).required(),
    }),
  });

export const EditUserSchema = yup.object({
    body: yup.object({
      firstName: yup.string().min(1),
        middleName: yup.string().min(1),
        lastName: yup.string().min(1),
        sSN: yup.number(),
        phoneNumber: yup.number(),
        email: yup.string().email(),
        address: yup.string(),
        extraNotes: yup.string(),
        type: yup.mixed().oneOf(["admin","user"]),
        applications:yup.mixed(),
        registered:yup.boolean()
    }),
    params: yup.object({
      id: yup.number().required(),
    })
  });

  export const GetUserSchema = yup.object({
    params: yup.object({
      id: yup.number().required(),
    }),
  });

  export const DeleteUserSchema = yup.object({
    params: yup.object({
      id: yup.number().required(),
    }),
  });

  export const GetUserListSchema = yup.object({
    query: yup.object({
        //stuff
    })
  });