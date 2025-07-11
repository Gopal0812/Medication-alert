import express from "express";
import { addMedication, getMedicine, updateMedicine, deleteMedicine } from "../controlleres/MedicationControler.js";


const medicationRoutes = express.Router()


medicationRoutes.post('/add-medicine', addMedication)
medicationRoutes.get('/getAllMedicine/:userId', getMedicine)
medicationRoutes.put('/update-medicine/:id', updateMedicine)
medicationRoutes.delete('/delete-medicine/:id', deleteMedicine)
export default medicationRoutes