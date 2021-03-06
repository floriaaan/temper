import React, { useState, useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { routes, tabs, auth, defaultRoute } from "./routes/web";

import { ThemeProvider, ColorModeProvider, CSSReset } from "@chakra-ui/core";


/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

import "bootstrap/dist/css/bootstrap.min.css";

/* Theme variables */
import { temper } from "./theme/temper";
import "./theme/variables.css";
import "./theme/app.css";
import { auth_middleware } from "./middleware/auth";
//import { auth_middleware } from "./middleware/auth";

const logged = (
  <ThemeProvider theme={temper}>
    <CSSReset />
    <ColorModeProvider>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            {routes.map((obj, key) => {
              return (
                <Route
                  path={obj.path}
                  component={obj.component}
                  exact={true}
                  key={key}
                />
              );
            })}

            <Route
              path="/"
              render={() => <Redirect to={defaultRoute} />}
              exact={true}
            />
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            {tabs.map((obj, key) => {
              return (
                <IonTabButton
                  tab={obj.label.toLowerCase()}
                  href={obj.path}
                  key={key}
                >
                  <IonIcon icon={obj.icon} />
                  <IonLabel>{obj.label}</IonLabel>
                </IonTabButton>
              );
            })}
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </ColorModeProvider>
  </ThemeProvider>
);

const notLogged = (
  <ThemeProvider theme={temper}>
    <CSSReset />
    <ColorModeProvider>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            {auth.map((obj, key) => {
              return (
                <Route
                  path={obj.path}
                  component={obj.component}
                  exact={true}
                  key={key}
                />
              );
            })}
            <Route
              path="/"
              render={() => <Redirect to="/login" />}
              exact={true}
            />
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            {auth.map((obj, key) => {
              return (
                <IonTabButton
                  tab={obj.label.toLowerCase()}
                  href={obj.path}
                  key={key}
                >
                  <IonIcon icon={obj.icon} />
                  <IonLabel>{obj.label}</IonLabel>
                </IonTabButton>
              );
            })}
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </ColorModeProvider>
  </ThemeProvider>
);

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(sessionStorage.getItem("darkMode") === 'true' || false);
  const handleDarkMode = (checked: boolean) => {
    setDarkMode(checked);
    sessionStorage.setItem("darkMode", `${checked}`);
    document.body.classList.toggle("dark", checked);

    
  };
  if (!sessionStorage.getItem("auth.logged")) {
    sessionStorage.setItem("auth.logged", "0");
  }
  useEffect(() => {
    handleDarkMode(darkMode);
    // eslint-disable-next-line
  }, []);
  
  auth_middleware();

  return <IonApp>{sessionStorage.getItem("auth.logged") === "1" ? logged : notLogged}</IonApp>;
};

export default App;
