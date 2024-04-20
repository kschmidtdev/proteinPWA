import { LitElement, css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { resolveRouterPath } from '../router';

import '@shoelace-style/shoelace/dist/components/button/button.js';
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBNg6V9p9nUwxFTNaazfgWCsyv1tFcp2eI",
  authDomain: "proteinpwa.firebaseapp.com",
  projectId: "proteinpwa",
  storageBucket: "proteinpwa.appspot.com",
  messagingSenderId: "550211047127",
  appId: "1:550211047127:web:4f0c360c03081f44f3ea92"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

console.log("hi there");

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(app);

@customElement('app-header')
export class AppHeader extends LitElement {
  @property({ type: String }) title = 'proteinPWA';

  @property({ type: Boolean}) enableBack: boolean = false;

  static styles = css`
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--app-color-primary);
      color: white;
      padding: 12px;
      padding-top: 4px;

      position: fixed;
      left: env(titlebar-area-x, 0);
      top: env(titlebar-area-y, 0);
      height: env(titlebar-area-height, 30px);
      width: env(titlebar-area-width, 100%);
      -webkit-app-region: drag;
    }

    header h1 {
      margin-top: 0;
      margin-bottom: 0;
      font-size: 12px;
      font-weight: bold;
    }

    nav a {
      margin-left: 10px;
    }

    #back-button-block {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
    }

    @media(prefers-color-scheme: light) {
      header {
        color: black;
      }

      nav a {
        color: initial;
      }
    }
  `;

  private urlBase64ToUint8Array(base64String : string) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  private async subscribeForPush() {
    const registration = await navigator.serviceWorker.ready;
    const convertedVapidKey = this.urlBase64ToUint8Array("BAd1pSGbPAPdwURoR5Mxpi916unwPs6sPFmG1lvGRLs6D3xuawmQCjIZDe8Ga4Az4R84LBKohKMDeHW0R1BkHXc");
    const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true, // Should be always true as currently browsers only support explicitly visible notifications
        applicationServerKey: convertedVapidKey
    });

    console.log("hello here too");
    // Send push subscription to our server to persist it
    //saveSubscription(pushSubscription);
  }

  private requestNotificationPermission() {
    if ("Notification" in window) {
      console.log("Notifications API is supported");

      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
          Promise.resolve(this.subscribeForPush());
        }
      });
    } else {
      console.log("Notifications API is not supported");
    }
  }

  private displayNotification() {
    const notifTitle = "Hi";
    const notifBody = "It's time to drink some water 💧🥤";
    const notifImg = "/assets/media/toast.jpg";
    const options = {
      body: notifBody,
      icon: notifImg,
    };
    new Notification(notifTitle, options);
  }

  render() {
    return html`
      <header>

        <div id="back-button-block">
          ${this.enableBack ? html`<sl-button size="small" href="${resolveRouterPath()}">
            Back
          </sl-button>` : null}

          <div id="notification" class="notification">
          <sl-button appearance="accent" @click=${this.requestNotificationPermission}>Request Permissions</sl-button>
          <sl-button appearance="accent" @click=${this.displayNotification}>Display Notifications</sl-button>

        </div>

          <h1>${this.title}</h1>
        </div>
      </header>
    `;
  }
}
