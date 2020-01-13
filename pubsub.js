const redis = require('redis');

//Constants of channels 
const CHANNELS = {
    TEST: 'TEST'
};

class PubSub {
    constructor() {
        //Create publishers and subscribers
        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();

        //Allow subscribers to receive messages 
        this.subscriber.subscribe(CHANNELS.TEST);

        this.subscriber.on(
            'message',
            (channel, message) => this.handleMessage(channel, message)
        );
    }

    handleMessage(channel, message) {
        console.log(`Message received. Channel: ${channel}. Message: ${message}`);
    }
}

const testPubSub = new PubSub();

//Set delay of 1000 milliseconds to ensure reliability of firing
setTimeout(() => testPubSub.publisher.publish(CHANNELS.TEST, 'foo'), 1000);