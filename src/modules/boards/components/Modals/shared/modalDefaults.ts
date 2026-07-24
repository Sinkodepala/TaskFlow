export const boardModalDefaults = {
  destroyOnHidden: true,
  focusTriggerAfterClose: false,
} as const;

export const logFormValidationError = (error: unknown) => {
  console.log(`Validation failed : ${error}`);
};
