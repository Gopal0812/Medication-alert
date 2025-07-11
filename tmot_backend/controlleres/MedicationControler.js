import Medication from "../models/medicatioModel.js"




export const addMedication = async (req, res) => {
  const {
    nameOfMedicine,
    dosage,
    time,
    frequency,
    daysOfWeek,
    startDate,
    endDate,
    userId, // Make sure you pass userId from auth or client
  } = req.body;

  try {
    // Validation
    if (
      !nameOfMedicine ||
      !dosage ||
      !time ||
      !frequency ||
      !Array.isArray(daysOfWeek) || daysOfWeek.length === 0 ||
      !startDate ||
      !endDate ||
      !userId
    ) {
      return res.status(400).json({ message: 'Please enter all fields.' });
    }

    const medication = await Medication.create({
      userId,
      nameOfMedicine,
      dosage,
      time,
      frequency,
      daysOfWeek,
      startDate,
      endDate,
    });

    res.status(201).json({ message: 'Medication added successfully', medication });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while adding medication' });
  }
};


export const getMedicine = async (req, res) => {
  const { userId } = req.params;

  try {
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const medicines = await Medication.find({ userId });

    if (!medicines.length) {
      return res.status(404).json({ message: 'No medications found for this user.' });
    }

    res.status(200).json(medicines);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching medications' });
  }
};



export const updateMedicine = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    if (!id) {
      return res.status(400).json({ message: 'medicationId is required' });
    }

    // Check if medication exists
    const existingMedication = await Medication.findById(id);
    if (!existingMedication) {
      return res.status(404).json({ message: 'Medication not found' });
    }

    // Update the medication
    const updatedMedication = await Medication.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: 'Medication updated successfully',
      medication: updatedMedication
    });
  } catch (error) {
    console.error('Update medicine error:', error);
    res.status(500).json({ message: 'Server error while updating medication' });
  }
};

export const deleteMedicine = async (req, res) => {
  const { id } = req.params;
  
  try {
    if (!id) {
      return res.status(400).json({ message: 'medicationId is required' });
    }

    // Check if medication exists
    const existingMedication = await Medication.findById(id);
    if (!existingMedication) {
      return res.status(404).json({ message: 'Medication not found' });
    }

    // Delete the medication
    const deletedMedication = await Medication.findByIdAndDelete(id);
    
    return res.status(200).json({
      message: 'Medication deleted successfully',
      medication: deletedMedication
    });
  } catch (error) {
    console.error('Delete medicine error:', error);
    res.status(500).json({ message: 'Server error while deleting medication' });
  }
}