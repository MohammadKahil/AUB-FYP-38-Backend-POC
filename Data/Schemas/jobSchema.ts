const yup = require("yup");

export const AddJobSchema = yup.object({
    body: yup.object({
        owner: yup.number().min(1).required(),
        status: yup.string().required(),
        phase: yup.string().required(),
        bucket: yup.string(),
    }),
  });


export const EditJobSchema = yup.object({
    body: yup.object({
        owner: yup.number().min(1),
        status: yup.string(),
        phase: yup.string(),
        bucket: yup.string(),
    }),
    params: yup.object({
      id: yup.string().required(),
    })
  });

  export const GetJobSchema = yup.object({
    params: yup.object({
      id: yup.string().required(),
    }),
  });

  export const DeleteJobSchema = yup.object({
    params: yup.object({
      id: yup.string().required(),
    }),
  });

  export const GetJobListSchema = yup.object({
    query: yup.object({
        //stuff
    })
  });