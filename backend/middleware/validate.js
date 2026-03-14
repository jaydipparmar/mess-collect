const Joi = require('joi');

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const messages = error.details.map((d) => d.message);
        return res.status(400).json({ success: false, message: messages.join('; ') });
    }
    next();
};

// --- Schemas ---

const signupSchema = Joi.object({
    collegeName: Joi.string().min(2).max(100).required(),
    name: Joi.string().min(2).max(100).required(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
        'string.pattern.base': 'Phone must be a 10-digit number',
    }),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.any()
        .valid(Joi.ref('password'))
        .required()
        .messages({ 'any.only': 'Passwords do not match' }),
    role: Joi.string().valid('student', 'contractor').required(),
    age: Joi.number().min(10).max(100).optional(),
    address: Joi.string().max(300).optional(),
});

const verifyOtpSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required(),
});

const loginSchema = Joi.object({
    emailOrPhone: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().valid('student', 'contractor').required(),
});

const feeSchema = Joi.object({
    month: Joi.string()
        .valid('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December')
        .required(),
    year: Joi.number().min(2000).required(),
    amount: Joi.number().min(1).required(),
});

const profileUpdateSchema = Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    age: Joi.number().min(10).max(100).optional(),
    address: Joi.string().max(300).optional(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).optional(),
});

module.exports = {
    validate,
    signupSchema,
    verifyOtpSchema,
    loginSchema,
    feeSchema,
    profileUpdateSchema,
};
