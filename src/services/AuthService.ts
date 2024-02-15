import {User, UserManager, UserManagerSettings, WebStorageStateStore} from "oidc-client-ts";

const settings: UserManagerSettings = {
    userStore: new WebStorageStateStore({store: window.localStorage}),
    authority: "http://example-spring-authorization-server.local:9000/",
    client_id: "example-vue-oauth2-authorization-code-pkce",
    redirect_uri: "http://127.0.0.1:5173/signin-callback",
    silent_redirect_uri: "http://127.0.0.1:5173/silent-callback.html",
    post_logout_redirect_uri: "http://127.0.0.1:5173/",
    response_type: "code",
    scope: "openid",
    loadUserInfo: true
};

export class AuthService {
    userManager: UserManager;

    constructor() {
        this.userManager = new UserManager(settings);

        this.userManager.events.addUserLoaded(newUser => {
            console.log("USER LOADED EVENT");

            this.userManager.storeUser(newUser);
            this.userManager.getUser().then(user => {
                console.log(user);
            });
        });

        this.userManager.events.addAccessTokenExpired(() => {
            this.userManager.signoutRedirect();
        })

        this.userManager.events.addSilentRenewError(error => {
            console.log("ERROR RENEWING ACCESS TOKEN.");
            console.log(error);
        });
    }

    getUser(): Promise<User | null> {
        return this.userManager.getUser();
    }

    login(): Promise<void> {
        return this.userManager.signinRedirect();
    }

    renewToken(): Promise<User | null> {
        return this.userManager.signinSilent();
    }

    logout(): Promise<void> {
        return this.userManager.signoutRedirect();
    }
}
