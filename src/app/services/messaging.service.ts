import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireMessaging } from '@angular/fire/messaging';
import {map, take} from 'rxjs/operators';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable()
export class MessagingService {

    private token: string;
    currentMessage = new BehaviorSubject(null);

    constructor(
        private angularFireDB: AngularFireDatabase,
        private angularFireAuth: AngularFireAuth,
        private angularFireMessaging: AngularFireMessaging,
        private http: HttpClient) {
        this.angularFireMessaging.messaging.subscribe(
            (_messaging) => {
                _messaging.onMessage = _messaging.onMessage.bind(_messaging);
                _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
            }
        );
    }

    /**
     * update token in firebase database
     *
     * @param userId userId as a key
     * @param token token as a value
     */
    updateToken(userId, token) {
        // we can change this function to request our backend service
        this.angularFireAuth.authState.pipe(take(1)).subscribe(
            () => {
                const data = {};
                data[userId] = token;
                this.token = token;
                console.log('updateToken', token);
                this.angularFireDB.object('fcmTokens/').update(data);
            });
    }

    /**
     * request permission for notification from firebase cloud messaging
     *
     * @param userId userId
     */
    requestPermission(userId, channelId) {
        this.angularFireMessaging.requestToken.subscribe(
            (token) => {
                console.log('requestPermission', token);
                this.updateToken(userId, token);
                this.token = token;
                // subscribe client to topic
                this.subscribeClient(channelId);
            },
            (err) => {
                console.error('Unable to get permission to notify.', err);
            }
        );
    }

    /**
     * hook method when new notification received in foreground
     */
    receiveMessage() {
        this.angularFireMessaging.messages.subscribe(
            (payload) => {
                console.log('new message received. ', payload);
                this.currentMessage.next(payload);
            });
    }

    subscribeClientAppToTopic(registrationToken, topicName): Observable<string> {
        const getParam = '?registrationToken=' + registrationToken
                        + '&topicName=' + topicName;
        return this.http.get(environment.apiURL + 'subscribeClientAppToTopic.php' + getParam, { responseType: 'text' })
            .pipe(map(data => {
                return <string>data;
            }));
    }

    subscribeClient(channel): void {
        this.subscribeClientAppToTopic(this.token, channel).subscribe(res => {
            console.log('subscribeClient', res);
        }, error => {
            console.error('subscribeClient', error);
        });
    }
}
