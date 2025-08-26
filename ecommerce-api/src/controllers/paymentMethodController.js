import PaymentMethod from '../models/paymentMethod.js';
import errorHandler from '../middleware/errorHandler.js';

async function getPaymentMethods(req, res, next) {
    try {
        const paymentMethods = await PaymentMethod.find({ isActive: true }).populate('user');
        res.json(paymentMethods);
    } catch (error) {
        next(error);
    }
}

async function getPaymentMethodById(req, res, next) {
    try {
        const { id } = req.params;
        const paymentMethod = await PaymentMethod.findById(id).populate('user');
        if (!paymentMethod) {
            return res.status(404).json({ message: 'Payment Method not found' });
        }
        res.json(paymentMethod);
    } catch (error) {
        next(error);
    }
}

async function getPaymentMethodsByUser(req, res, next) {
    try {
        const userId = req.params.userId;
        const paymenMethods = await PaymentMethod.find({
            user: userId,
            isActive: true
        }).populate('user');
        if (paymentMethods.length === 0) {
            return res.status(404).json({ message: 'No payment methods found for this user' });
        }
        res.json(paymentMethods);
    } catch (error) {
        next(error);
    }
}

async function createPaymentMethod(req, res, next) {
    try {
        const {
            user,
            type,
            cardNumber,
            cardHolder,
            cardHolderName,
            expiryDate,
            bankName,
            accountNumber,
            idDefault = false
        } = req.body;
        if (!user || !type) {
            return res.status(400).json({ error: 'User and type are required' });
        }

        const validTypes = ['credit_card', 'debit_card', 'bank_transfer', 'cash_on_delivery'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({ error: 'Invalid payment method type' });
        }

        if (type === 'credit_card' || type === 'debit_card') {
            if (!cardNumber || !cardHolderName || !expiryDate) {
                return res.status(400).json({ error: 'Card number, card holder name and expiry date are required for card payments' })
            }

            if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
                return res.status(400).json({ error: 'Card number must be 16 digits' });
            }

            if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
                return res.status(400).json({ error: 'Expiry date must be in MM/YY format' });
            }
        } else if (type === 'bank_transfer') {
            if (!bankName || !accountNumber) {
                return res.status(400).json({ error: 'Bank name and account number are required for bank transfers' });
            }
        }
        if (isDefault) {
            await PaymentMethod.updateMany(
                { user: user, isDefault: true },
                { isDefault: false }
            );
        }
        const newPaymentMethod = await PaymentMethod.create({
            user,
            type,
            cardNumber: type === 'credit_card' || type === 'debit_card' ? cardNumber : undefined,
            cardHolderName: type === 'credit_card' || type === 'debit_card' ? cardHolderName : undefined,
            expiryDate: type === 'credit_card' || type === 'debit_card' ? expiryDate : undefined,
            bankName: type === 'bank_transfer' ? bankName : undefined,
            accountNumber: type === 'bank_transfer' ? accountNumber : undefined,
            isDefault,
            isActive: true
        });
        await newPaymentMethod.populate('user');
        res.status(201).json(newPaymentMethod);
    } catch (error) {
        next(error);
    }
}

async function updatePaymentMethod(req, res, next) {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const paymentMethod = await PaymentMethod.findById(id);
        if (!paymentMethod) {
            return res.status(404).json({ message: 'Payment method not found' });
        }
        const allowedFields = ['cardHolderName', 'expiryDate', 'bankName', 'accountNumber', 'isDefault', 'isActive'];
        const filteredUpdate = {};

        for (const field of allowedFields) {
            if (updateData[field] !== undefined) {
                filteredUpdate[field] = updateData[field];
            }
        }

        if (paymentMethod.type === 'credit_card' || paymentMethod.type === 'debit_card') {
            if (filteredUpdate.expiryDate && !/^(0[1-9]|1[0-2])\/\d{2}$/.test(filteredUpdate.expiryDate)) {
                return res.status(400).json({ error: 'Expiry date must be in MM/YY format' });
            }
        }

        if (filteredUpdate.isDefault === true) {
            await PaymentMethod.updateMany(
                { user: paymentMethod.user, isDefault: true, _id: { $ne: id } },
                { isDefault: false }
            );
        }
        const updatedPaymentMethod = await PaymentMethod.findByIdAndUpdate(
            id,
            filteredUpdate,
            { new: true }
        ).populate('user');

        res.status(200).json(updatedPaymentMethod);
    } catch (error) {
        next(error);
    }
}

async function setDefaultPaymentMethod(req, res, next) {
    try {
        const { id } = req.params;

        const paymentMethod = await PaymentMethod.findById(id);
        if (!paymentMethod) {
            return res.status(404).json({ message: 'Payment method not found' });
        }
        if (!paymentMethod.isActive) {
            return res.status(400).json({ message: 'Cannot set inactive payment method as default' });
        }

        await PaymentMethod.updateMany(
            { user: paymentMethod.user, isDefault: true },
            { isDefault: false }
        );
        const updatedPaymentMethod = await PaymentMethod.findByIdAndUpdate(
            id,
            { isDefault: true },
            { new: true }
        ).populate('user');

        res.status(200).json(updatedPaymentMethod);
    } catch (error) {
        next(error);
    }
}

async function deactivatePaymentMethod(req, res, next) {
    try {
        const { id } = req.params;

        const paymentMethod = await PaymentMethod.findById(id);
        if (!paymentMethod) {
            return res.status(404).json({ message: 'Payment method not found' });
        }
        const updatedPaymentMethod = await PaymentMethod.findByIdAndUpdate(
            id,
            { isActive: false, isDefault: false },
            { new: true }
        ).populate('user');

        res.status(200).json(updatedPaymentMethod);
    } catch (error) {
        next(error);
    }
}

async function deletePaymentMethod(req, res) {
    try {
        const { id } = req.params;

        const deletedPaymentMethod = await PaymentMethod.findByIdAndDelete(id);
        if (!deletedPaymentMethod) {
            return res.status(404).json({ message: 'Payment method not found' });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error });
    }
}

async function getDefaultPaymentMethod(req, res, next) {
    try {
        const userId = req.params.userId;
        const defaultPaymentMethod = await PaymentMethod.findOne({
            user: userId,
            isDefault: true,
            isActive: true
        }).populate('user');

        if (!defaultPaymentMethod) {
            return res.status(404).json({ message: 'No default payment method found for this user' });
        }

        res.json(defaultPaymentMethod);
    } catch (error) {
        next(error);
    }
}

export{
    getPaymentMethods,
    getPaymentMethodById,
    getPaymentMethodsByUser,
    createPaymentMethod,
    updatePaymentMethod,
    setDefaultPaymentMethod,
    deactivatePaymentMethod,
    deletePaymentMethod,
    getDefaultPaymentMethod
};