import React, { useState } from "react";
import "./Probe.css";
import "leaflet/dist/leaflet.css";

import {
  IonItem,
  IonButton,
  IonCardContent,
  IonSkeletonText,
  IonIcon,
} from "@ionic/react";

//import moment from "moment";
import cx from "classnames";

import { useHistory } from "react-router-dom";
import { Heading, Box, Spinner } from "@chakra-ui/core";
import { menuOutline } from "ionicons/icons";

interface ContainerProps {
  data: {
    id: number;
    name: string;
    state: boolean;
    category: string;
    lastmeasure: {
      temperature: number;
      humidity: number;
      date: string;
    } | null;
    token: string;
    gps: {
      lon: number | null;
      lat: number | null;
    } | null;
  };
}

const Probe: React.FC<ContainerProps> = ({ data }) => {
  const [probe, setProbeData] = useState(data);
  const [state, setState] = useState({
    loading: false,
    spinner: false,
  });

  const handleToggle = () => {
    setState({ ...state, spinner: true });
    fetch(
      "http://" +
      window.location.hostname +
      ":8000/api/v1/probe/" +
      probe.token +
      "/toggle",
      {
        method: "PUT",
      }
    )
      .then((res) => res.json())
      .then((result) => {
        setProbeData({ ...probe, state: result.response.data.state });
        setState({ ...state, spinner: false });
      });
  };

  const history = useHistory();
  const navigateTo = () => history.push("/probe/" + probe.token);

  return (
    <Box
      maxW="sm"
      borderWidth="0px"
      rounded="lg"
      overflow="hidden"
      style={{ height: "200px" }}
    >
      {!state.loading ? (
        <>
          <IonItem>
            <Heading as="h6" size="md" style={{ fontWeight: "normal" }}>
              {probe.name ? probe.name : "Probe #" + probe.token}
              {probe.state ? (
                <span className="dot dot-active"> </span>
              ) : (
                  <span className="dot dot-disabled"></span>
                )}
              {state.spinner ? <Spinner size="xs" className="ml-3" /> : ""}
            </Heading>

            <IonButton
              fill="clear"
              slot="end"
              onClick={() => {
                navigateTo();
              }}
            >
              <IonIcon icon={menuOutline} size="lg"></IonIcon>
            </IonButton>
          </IonItem>

          <IonCardContent className="weather-container">
            <div
              className={cx("weather-card", {
                "card-active": probe.state,
                "card-disabled": !probe.state,
              })}
              onClick={() => handleToggle()}
            >
              <>
                {probe.state ? (
                  <>
                    <div className="icon icon-anim">
                      <div className="bolt"></div>
                      <div className="bolt"></div>
                    </div>
                  </>
                ) : (
                    <div className="icon">
                      <div className="unbolt"></div>
                    </div>
                  )}
              </>
              {probe.lastmeasure?.temperature ? (
                <>
                  <h1>{probe.lastmeasure?.temperature}°C</h1>
                  <p>{probe.lastmeasure?.humidity} %</p>
                </>
              ) : (
                  <>
                    <h1> </h1>
                    <p><span role="img" aria-label="No measure">❌</span>&nbsp;No measure</p>
                  </>
                )}
            </div>
          </IonCardContent>
        </>
      ) : (
          <>
            <IonSkeletonText
              animated
              style={{ heigth: "25vh", width: "30%" }}
            ></IonSkeletonText>
          </>
        )}
    </Box>
  );
};

export default Probe;
