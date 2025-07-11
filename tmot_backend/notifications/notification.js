import admin from '../config/firebase.js'

const sendPushNotification = async (fcmToken, title, body) => {
    const message = {
        token: fcmToken,
        notification: {
            title,
            body,
        },
        android: {
            priority: 'high',
        },
    };
    console.log(message)
    try {
        const response = await admin.messaging().send(message);
        console.log('Notification sent:', response);
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};

export default sendPushNotification;
