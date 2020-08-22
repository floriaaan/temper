import React, { useState, useEffect } from "react";
import "./Place.css";
import {
  IonRow,
  IonCol,
  IonContent,
  IonSkeletonText,
  IonSearchbar,
  IonModal,
  IonButton,
  IonSpinner,
  IonItem,
  IonInput,
  IonLabel,
  IonIcon,
  IonListHeader,
  IonList,
  IonToast,
} from "@ionic/react";
import Place from "./Place";
//import { ToastContainer, toast } from "react-toastify";
import { addOutline } from "ionicons/icons";
import CategoryHeader from "../../Layout/CategoryHeader";

import "leaflet/dist/leaflet.css";
import { Map, TileLayer, Marker } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";

import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(faMapMarkerAlt);

interface ContainerProps {
  token: string;
}

const PlaceList: React.FC<ContainerProps> = ({ token }) => {
  let any: any[] = [];
  const [dataList, setDataList] = useState(any);
  const [places, setPlacesState] = useState({
    loading: true,
    content: [<React.Fragment key={0}></React.Fragment>],
    addmodal: {
      show: false,
      spinner: false,
      input: {
        name: "",
        category: "",
        gps: {
          lat: 9999,
          lng: 9999,
        },
      },
    },
    search: "",
    toast: { show: false, message: "", duration: 3000 }
  });

  let auth_json = JSON.parse(
    sessionStorage.getItem("auth") ||
    `{"user": {"name": "","email": ""},"token": ""}`
  );

  const createList = (data: any) => {
    return data.map((obj: any, key: any) => {
      return (
        <li className="list-inline-item list--inline--item" key={key}>
          <Place data={obj} />
        </li>
      );
    });
  }

  const fetchData = async () => {
    const response = await fetch(
      "http://" + window.location.hostname + ":8000/api/v1/place/user/" + token
    );
    const body = await response.json();

    setDataList(body.response.data || []);
    setPlacesState({ ...places, content: createList(body.response.data), loading: false });
  };

  useEffect(() => {
    fetchData();
    //eslint-disable-next-line
  }, [places.loading]);

  const handleSearch = (value: string) => {
    if (value !== '') {
      let newContent = dataList.filter(data => {
        /*console.log('data',data);
        console.log('filters', data.name.toLowerCase(), value.toLowerCase());
        console.log('boolean', data.name.toLowerCase().startsWith(value.toLowerCase()));
        console.log('#########################');*/
        if (data.name.toLowerCase().startsWith(value.toLowerCase())) {
          return data;
        }
      });
      setPlacesState({
        ...places,
        content: createList(newContent),
        search: value
      });
    } else {
      setPlacesState({
        ...places,
        content: createList(dataList),
        search: value
      });
    }
  };

  const placePopover = (
    <>
      <IonList>
        <IonListHeader className="mb-2">Places</IonListHeader>
        <IonItem
          button
          onClick={() =>
            setPlacesState({
              ...places,
              addmodal: { ...places.addmodal, show: true },
            })
          }
        >
          <IonIcon icon={addOutline}></IonIcon>
          <IonLabel className="ml-3">Add a place</IonLabel>
        </IonItem>
      </IonList>
    </>
  );

  const addPost = () => {
    setPlacesState({
      ...places,
      addmodal: { ...places.addmodal, spinner: true },
    });
    fetch("http://" + window.location.hostname + ":8000/api/v1/place/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: auth_json.token,
        name: places.addmodal.input.name,
        gps_lon: places.addmodal.input.gps.lng,
        gps_lat: places.addmodal.input.gps.lat,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.response) {
          setPlacesState({
            ...places,
            addmodal: {
              ...places.addmodal,
              spinner: false,
              show: false,
              input: {
                ...places.addmodal.input,
                name: "",
                category: "",
              },
            },
          });
          fetchData();

          setTimeout(() => {
            setPlacesState({ ...places, content: createList(dataList), toast: { ...places.toast, show: true, duration: 3000, message: '✅ Place is successfully added' } })
          }, 1000);
          /*toast.success("✅ Place is successfully added", {
                      position: "top-right",
                      autoClose: 3000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    });*/
        } else {
          /*toast.error("⛔ Error while adding the place", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });*/

          setPlacesState({ ...places, toast: { ...places.toast, show: true, duration: 3000, message: '⛔ Error while adding the place' } })
        }
        setPlacesState({
          ...places,
          addmodal: {
            ...places.addmodal,
            spinner: false,
            show: false,
            input: {
              ...places.addmodal.input,
              name: "",
              category: "",
            },
          },
        });
      });
  };

  const handleGPSSelection = (e: LeafletMouseEvent) => {
    setPlacesState({
      ...places,
      addmodal: {
        ...places.addmodal,
        input: {
          ...places.addmodal.input,
          gps: e.latlng,
        },
      },
    });
  };

  return (
    <>
      <IonContent className="ml-5 cast--content--height">
        <CategoryHeader
          title="Places"
          icon="map-marker-alt"
          menu={placePopover}
          chip=""
        ></CategoryHeader>
        <IonSearchbar
          value={places.search}
          onIonChange={(e) => handleSearch(e.detail.value!)}
          showCancelButton="focus"
          animated
        ></IonSearchbar>
        {!places.loading ? (
          <>
            <div className="row align-content-center p-4 list--inline--wrapper mr-3">
              <ul className="list-inline mr-5">{places.content}</ul>
            </div>
          </>
        ) : (
            <>
              <IonSkeletonText animated style={{ height: "30vh" }} />
            </>
          )}
      </IonContent>

      <IonModal isOpen={places.addmodal.show} cssClass="modal-create">
        <IonContent>
          <div className="p-3">
            <IonRow>
              <IonCol sizeLg="12">
                <div className="display-5" style={{ fontFamily: "Nunito" }}>
                  Details of{" "}
                  {places.addmodal.input.name
                    ? places.addmodal.input.name
                    : "place"}
                </div>

                <IonItem>
                  <IonLabel position="floating">Name</IonLabel>
                  <IonInput
                    value={places.addmodal.input.name}
                    onIonChange={(e) =>
                      setPlacesState({
                        ...places,
                        addmodal: {
                          ...places.addmodal,
                          input: {
                            ...places.addmodal.input,

                            name: e.detail.value!,
                          },
                        },
                      })
                    }
                  ></IonInput>
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">Category</IonLabel>
                  <IonInput
                    value={places.addmodal.input.category}
                    onIonChange={(e) =>
                      setPlacesState({
                        ...places,
                        addmodal: {
                          ...places.addmodal,
                          input: {
                            ...places.addmodal.input,
                            category: e.detail.value!,
                          },
                        },
                      })
                    }
                  ></IonInput>
                </IonItem>
              </IonCol>

              <IonCol sizeLg="12">
                <div className="display-6" style={{ fontFamily: "Nunito" }}>
                  Location of{" "}
                  {places.addmodal.input.name
                    ? places.addmodal.input.name
                    : "place"}
                </div>
                <Map
                  center={[43, 1]}
                  zoom={3}
                  style={{ height: "200px", width: "99%" }}
                  onclick={(e) => handleGPSSelection(e)}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="Temper 💞"
                  />
                  {places.addmodal.input.gps.lat !== 9999 &&
                    places.addmodal.input.gps.lng !== 9999 ? (
                      <Marker
                        position={[
                          places.addmodal.input.gps.lat!,
                          places.addmodal.input.gps.lng!,
                        ]}
                      ></Marker>
                    ) : (
                      ""
                    )}
                </Map>
              </IonCol>
            </IonRow>
            <hr className="mx-2 my-4" />

            <IonButton color="success" onClick={() => addPost()}>
              Validate
              {places.addmodal.spinner ? (
                <IonSpinner name="crescent" className="ml-3" />
              ) : (
                  ""
                )}
            </IonButton>
            <IonButton
              color="secondary"
              slot="end"
              onClick={() =>
                setPlacesState({
                  ...places,
                  addmodal: { ...places.addmodal, show: false },
                })
              }
            >
              Close
            </IonButton>
          </div>
        </IonContent>
      </IonModal>

      <IonToast
        isOpen={places.toast.show}
        duration={places.toast.duration}
        onDidDismiss={() => setPlacesState({ ...places, toast: { ...places.toast, show: false } })}
        message={places.toast.message}
        position="bottom"
        buttons={[
          {
            side: 'start',
            icon: 'star',
            text: 'Favorite',
            handler: () => {
              console.log('Favorite clicked');
            }
          },
          {
            text: 'Done',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]}
      />


    </>
  );
};

export default PlaceList;
