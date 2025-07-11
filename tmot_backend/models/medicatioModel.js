import mongoose from "mongoose";


const MedicationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    nameOfMedicine: {
        type: String,
        required: true
    },
    dosage: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    frequency: {
        type: String,
        enum: ['once', 'daily', 'custom'],
        default: 'daily'
    },
    daysOfWeek: {
        type: [String],
        default: []
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },

})
const Medication = mongoose.models.Medication || mongoose.model('Medication', MedicationSchema)
export default Medication