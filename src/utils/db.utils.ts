export const DEFAULT_OPTIONS_SCHEMA: any = {
  timestamps: true,

  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (_: any, converted: any): void => {
      delete converted._id;
    },
  },
  toObject: {
    virtuals: true,
    versionKey: false,
    transform: (_: any, converted: any): void => {
      delete converted._id;
    },
  },
};
