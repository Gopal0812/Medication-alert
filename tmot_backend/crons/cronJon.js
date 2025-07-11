import sendPushNotification from '../notifications/notification.js'
import { dbConect } from '../config/db.js'
import Medication from '../models/medicatioModel.js'
import User from '../models/UserModel.js'
import cron from 'node-cron'

const startCronJob = async () => {
    try {
      await dbConect(); // ✅ ensure DB is connected first
  
      console.log('🕒 Medication reminder cron job started...');
  
      cron.schedule('* * * * *', async () => {
        const now = new Date();
        const currentTime = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  
        try {
          console.log(`🔍 Checking medications for time: ${currentTime}`);
          const medications = await Medication.find({ time: currentTime });
          console.log(`📋 Found ${medications.length} medications for current time`);
  
          for (const med of medications) {
            const user = await User.findById(med.userId);
            if (user?.fcmToken) {
              console.log(`📱 Sending notification to user: ${user.username} for medication: ${med.nameOfMedicine}`);
              await sendPushNotification(
                user.fcmToken, 
                'Medication Reminder', 
                `Time to take ${med.nameOfMedicine} - ${med.dosage}`
              );
            } else {
              console.log(`⚠️ No FCM token found for user: ${med.userId}`);
            }
          }
        } catch (error) {
          console.error('[NODE-CRON] [ERROR]', error);
        }
      });
  
    } catch (error) {
      console.error('❌ Cron job failed to start:', error);
    }
  };
  
  startCronJob();