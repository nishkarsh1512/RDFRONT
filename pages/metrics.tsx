import React, { useState, useEffect } from "react"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import axios from "axios"

///////

import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import useDeviceStore from "../store/device"
import OptionsDrawer from "../components/Core/DrawerButton/OptionsDrawer"
import { Grid, Paper, Typography } from "@mui/material"
import { alpha, styled } from "@mui/material/styles"
import MetricCard from "./metriccard"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import { showNotification } from "@mantine/notifications"
import {
  Box,
  FormControlLabel,
  Skeleton,
  Button,
  Tooltip,
  Switch,
} from "@mui/material"
import useTimeStore from "../store/time"
import moment from "moment"
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined"
import { gridColumnsTotalWidthSelector } from "@mui/x-data-grid"
import Layout from "../layout/dashboard"
import LogoutModal from "../components/Core/Modal/LogoutModal"
import { useRouter } from "next/router"
import Sidebar from "../components/Core/Sidebar/Sidebar"
import useAuthStore from "../store/auth"
import Modal from "@mui/material/Modal"
import LinearProgress from "@mui/material/LinearProgress"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"

import classNames from "classnames"
import Link from "next/link"
import { menuItems } from "../assets/links"
import { useAppStateContext } from "../context/contextProvider"
import { Divider } from "@mui/material"
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft"
import { NoSsr } from "@mui/base"

import { useContext } from "react"
import { useMemo } from "react"

interface DataItem {
  et: number
  knn: number
  rf: number
  bp: number
  start_time: string
}

interface MyObject {
  [key: string]: number
}

const card = (
  <React.Fragment>
    <CardContent>
      <Typography sx={{ fontSize: 28 }} color="text.secondary" gutterBottom>
        <b>Metric Information</b>
      </Typography>
      <Typography variant="h5" component="div">
        0: Healthy <br /> 1: Looseness <br /> 2: Misalignment <br /> 3:
        Anomalous Vibration
      </Typography>
    </CardContent>
  </React.Fragment>
)

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  color: "background.paper",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
}

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material"

const theme = createTheme()

const Metrics: React.FC = () => {
  const { selectedDevice } = useDeviceStore()
  const [myObject, setMyObject] = useState<MyObject>({})
  const [latestBp, setLatestBp] = useState<MyObject>({})
  const [latestKnn, setLatestKnn] = useState<MyObject>({})
  const [latestRf, setLatestRf] = useState<MyObject>({})
  const [latestEt, setLatestEt] = useState<MyObject>({})
  const [filt, setFilt] = useState<MyObject>({})
  const [isRealtime, setIsRealtime] = useState<boolean>(true)
  const [opens, setOpens] = React.useState(true)

  // Initial data array
  const [data, setData] = useState<number[]>([1, 2, 3, 4, 5])
  const [xLabels, setxLabels] = useState<string[]>([
    "apple",
    "mango",
    "pineapple",
    "potato",
    "tomato",
  ])
  //////////////////
  ////////////////////////

  /////////////////////
  //////////////////////
  const [progress, setProgress] = React.useState(0)
  const [buffer, setBuffer] = React.useState(10)

  const progressRef = React.useRef(() => {})
  React.useEffect(() => {
    progressRef.current = () => {
      if (progress > 100) {
        setProgress(0)
        setBuffer(10)
      } else {
        const diff = Math.random() * 10
        const diff2 = Math.random() * 10
        setProgress(progress + diff)
        setBuffer(progress + diff + diff2)
      }
    }
  })
  ////////////////
  /////////////////////////
  /////////////////

  //////////

  const yLabels: Record<number, string> = {
    0: "Healthy",
    1: "Looseness",
    2: "Misalignment",
    3: "Anomalous Vibration",
  }

  const [age, setAge] = React.useState("10")

  const change = (event: SelectChangeEvent) => {
    const temp = event.target.value
    setAge(temp)

    handleChange(temp)
  }

  const handleChange = (updatedValue: string) => {
    console.log("value of age is")
    console.log(updatedValue)
    setOpens(true)

    if (updatedValue == "10") {
      /////////////////////
      ///////////////////// AXIOS FOR ET
      if (isRealtime) {
        const article = { title: selectedDevice.asset_id }
        axios
          .post("http://localhost:4000/api/threshold/metrics", article)
          .then((response) => {
            const etData: number[] = response.data[0].result.map(
              (item: DataItem) => item.et
            )
            const xLabels: string[] = response.data[0].result.map(
              (item: DataItem) => item.start_time
            )
            console.log("printing et data")
            console.log(etData)
            console.log(response.data[0].result)

            setData(etData)
            setxLabels(xLabels)

            setOpens(false)
          })
      } else if (!isRealtime) {
        //////\WRITING OUT THE FILTER CONDITION
        const article = {
          title: selectedDevice?.asset_id,
          startDate: startTime,
          endDate: endTime,
        }
        axios
          .post("http://localhost:4000/api/threshold/check", article)
          .then((response) => {
            console.log("point of attraction")
            console.log("point of attraction")

            console.log(response.data)
            const etData: number[] = response.data.map(
              (item: DataItem) => item.et
            )

            const xLabels: string[] = response.data.map(
              (item: DataItem) => item.start_time
            )

            setxLabels(xLabels)
            setData(etData)
            console.log(etData)
            setFilt(response.data[0])
            console.log("point of attraction")
            setOpens(false)
            console.log("point of attraction")
          })
        //////ENDING THE FILTER CONDITION
      }
      ///////////////////// AXIOS FOR ET
      //////////////////////
    } else if (updatedValue == "20") {
      //////////////////////////
      /////////////////////////AXIOS FOR RF/
      if (isRealtime) {
        const article = { title: selectedDevice.asset_id }
        axios
          .post("http://localhost:4000/api/threshold/metrics", article)
          .then((response) => {
            const knnData: number[] = response.data[0].result.map(
              (item: DataItem) => item.knn
            )
            console.log("printing knn data")
            console.log(knnData)
            console.log(response.data[0].result)
            const xLabels: string[] = response.data[0].result.map(
              (item: DataItem) => item.start_time
            )

            setData(knnData)
            setxLabels(xLabels)

            setOpens(false)
          })
      } else if (!isRealtime) {
        const article = {
          title: selectedDevice?.asset_id,
          startDate: startTime,
          endDate: endTime,
        }
        axios
          .post("http://localhost:4000/api/threshold/check", article)
          .then((response) => {
            console.log(response.data)
            const knnData: number[] = response.data.map(
              (item: DataItem) => item.knn
            )

            const xLabels: string[] = response.data.map(
              (item: DataItem) => item.start_time
            )

            setxLabels(xLabels)
            setData(knnData)
            console.log(knnData)
            setFilt(response.data[0])
            setOpens(false)
          })
      }
      //////////////////////////AXIOS FOR RF
      ///////////////////////////////////////
    } else if (updatedValue == "40") {
      ////////////////////////////AXIOS FOR BP
      /////////////////////////////////
      if (isRealtime) {
        const article = { title: selectedDevice.asset_id }
        axios
          .post("http://localhost:4000/api/threshold/metrics", article)
          .then((response) => {
            const bpData: number[] = response.data[0].result.map(
              (item: DataItem) => item.bp
            )
            console.log("printing bp data")
            console.log(bpData)
            console.log(response.data[0].result)
            const xLabels: string[] = response.data[0].result.map(
              (item: DataItem) => item.start_time
            )
            setData(bpData)
            setxLabels(xLabels)
            setOpens(false)
          })
      } else if (!isRealtime) {
        const article = {
          title: selectedDevice?.asset_id,
          startDate: startTime,
          endDate: endTime,
        }
        axios
          .post("http://localhost:4000/api/threshold/check", article)
          .then((response) => {
            console.log(response.data)
            const bpData: number[] = response.data.map(
              (item: DataItem) => item.bp
            )

            const xLabels: string[] = response.data.map(
              (item: DataItem) => item.start_time
            )

            setxLabels(xLabels)
            setData(bpData)
            console.log(bpData)
            setFilt(response.data[0])
            setOpens(false)
          })
      }
    } else if (updatedValue == "30") {
      /////////////////////////]
      /////////////////////////////AXIOS FOR KNN
      if (isRealtime) {
        const article = { title: selectedDevice.asset_id }
        axios
          .post("http://localhost:4000/api/threshold/metrics", article)
          .then((response) => {
            const rfData: number[] = response.data[0].result.map(
              (item: DataItem) => item.rf
            )
            console.log("printing rff data")
            console.log(rfData)
            console.log(response.data[0].result)
            const xLabels: string[] = response.data[0].result.map(
              (item: DataItem) => item.start_time
            )

            setData(rfData)
            setxLabels(xLabels)

            setOpens(false)
          })
      } else if (!isRealtime) {
        ////
        const article = {
          title: selectedDevice?.asset_id,
          startDate: startTime,
          endDate: endTime,
        }
        axios
          .post("http://localhost:4000/api/threshold/check", article)
          .then((response) => {
            console.log(response.data)
            const rfData: number[] = response.data.map(
              (item: DataItem) => item.rf
            )

            const xLabels: string[] = response.data.map(
              (item: DataItem) => item.start_time
            )

            setxLabels(xLabels)
            setData(rfData)
            console.log(rfData)
            setFilt(response.data[0])
            setOpens(false)
          })
        //
      }
      ///////////////////////////////AXIOS FOR KNN2
      /////////////////////////////////////
    }
  }

  // Function to update the data array with random values

  // useEffect(() => {
  //   setAge("10")
  //   const article = { title: selectedDevice?.asset_id }
  //   axios
  //     .post("http://localhost:4000/api/threshold/metrics", article)
  //     .then((response) => {
  //       console.log("first time running")
  //       console.log("first time running")

  //       console.log("first time running")

  //       console.log("first time running")

  //       console.log("first time running")

  //       console.log("first time running")

  //       const etData: number[] = response.data[0].result.map(
  //         (item: DataItem) => item.et
  //       )
  //       const xLabels: string[] = response.data[0].result.map(
  //         (item: DataItem) => item.start_time
  //       )

  //       setData(etData)
  //       setxLabels(xLabels)

  //       setMyObject(response.data[0].startObject)
  //       setLatestBp(response.data[0].latestDocumentsBp)
  //       setLatestEt(response.data[0].latestDocumentsEt)
  //       setLatestKnn(response.data[0].latestDocumentsKnn)
  //       setLatestRf(response.data[0].latestDocumentsRf)
  //     })
  // }, [])

  // useEffect(() => {
  //   setOpens(true)
  //   console.log("this one is from age handler")
  //   if (age == "10") {
  //     const article = { title: selectedDevice?.asset_id }
  //     axios
  //       .post("http://localhost:4000/api/threshold/metrics", article)
  //       .then((response) => {
  //         if (isRealtime) {
  //           const etData: number[] = response.data[0].result.map(
  //             (item: DataItem) => item.et
  //           )
  //           const xLabels: string[] = response.data[0].result.map(
  //             (item: DataItem) => item.start_time
  //           )

  //           setData(etData)
  //           setxLabels(xLabels)
  //         } else {
  //           const article = {
  //             title: selectedDevice?.asset_id,
  //             startDate: startTime,
  //             endDate: endTime,
  //           }
  //           axios
  //             .post("http://localhost:4000/api/threshold/check", article)
  //             .then((response) => {
  //               console.log("point of attraction")
  //               console.log("point of attraction")

  //               console.log(response.data)
  //               const etData: number[] = response.data.map(
  //                 (item: DataItem) => item.et
  //               )

  //               const xLabels: string[] = response.data.map(
  //                 (item: DataItem) => item.start_time
  //               )

  //               setxLabels(xLabels)
  //               setData(etData)
  //               console.log(etData)
  //               setFilt(response.data[0])
  //               console.log("point of attraction")

  //               console.log("point of attraction")
  //             })
  //         }
  //       })
  //   } else if (age == "20") {
  //     const article = { title: selectedDevice?.asset_id }
  //     axios
  //       .post("http://localhost:4000/api/threshold/metrics", article)
  //       .then((response) => {
  //         if (isRealtime) {
  //           const knnData: number[] = response.data[0].result.map(
  //             (item: DataItem) => item.et
  //           )
  //           const xLabels: string[] = response.data[0].result.map(
  //             (item: DataItem) => item.start_time
  //           )

  //           setData(knnData)
  //           setxLabels(xLabels)
  //         } else {
  //           const article = {
  //             title: selectedDevice?.asset_id,
  //             startDate: startTime,
  //             endDate: endTime,
  //           }
  //           axios
  //             .post("http://localhost:4000/api/threshold/check", article)
  //             .then((response) => {
  //               console.log("point of attraction")
  //               console.log("point of attraction")

  //               console.log(response.data)
  //               const knnData: number[] = response.data.map(
  //                 (item: DataItem) => item.knn
  //               )

  //               const xLabels: string[] = response.data.map(
  //                 (item: DataItem) => item.start_time
  //               )

  //               setxLabels(xLabels)
  //               setData(knnData)
  //               setFilt(response.data[0])
  //               console.log("point of attraction")

  //               console.log("point of attraction")
  //             })
  //         }
  //       })
  //   } else if (age == "40") {
  //     const article = { title: selectedDevice?.asset_id }
  //     axios
  //       .post("http://localhost:4000/api/threshold/metrics", article)
  //       .then((response) => {
  //         if (isRealtime) {
  //           const bestData: number[] = response.data[0].result.map(
  //             (item: DataItem) => item.bp
  //           )
  //           const xLabels: string[] = response.data[0].result.map(
  //             (item: DataItem) => item.start_time
  //           )

  //           setData(bestData)
  //           setxLabels(xLabels)
  //         } else {
  //           /////////////////////////////////////////////BEST
  //           /////////////////////////////////////////////
  //           const article = {
  //             title: selectedDevice?.asset_id,
  //             startDate: startTime,
  //             endDate: endTime,
  //           }
  //           axios
  //             .post("http://localhost:4000/api/threshold/check", article)
  //             .then((response) => {
  //               console.log("point of attraction")
  //               console.log("point of attraction")

  //               console.log(response.data)
  //               const bestData: number[] = response.data.map(
  //                 (item: DataItem) => item.bp
  //               )

  //               const xLabels: string[] = response.data.map(
  //                 (item: DataItem) => item.start_time
  //               )

  //               setxLabels(xLabels)
  //               setData(bestData)
  //               setFilt(response.data[0])
  //               console.log("point of attraction")

  //               console.log("point of attraction")
  //             })
  //           //////////////////////////////////////////////
  //           //////////////////////////////////////////////best
  //         }
  //       })
  //   } else {
  //     const article = { title: selectedDevice?.asset_id }
  //     axios
  //       .post("http://localhost:4000/api/threshold/metrics", article)
  //       .then((response) => {
  //         if (isRealtime) {
  //           const rfData: number[] = response.data[0].result.map(
  //             (item: DataItem) => item.et
  //           )
  //           const xLabels: string[] = response.data[0].result.map(
  //             (item: DataItem) => item.start_time
  //           )

  //           setData(rfData)
  //           setxLabels(xLabels)
  //         } else {
  //           ///////////////////rf//]\//////////////////
  //           ///////////////
  //           const article = {
  //             title: selectedDevice?.asset_id,
  //             startDate: startTime,
  //             endDate: endTime,
  //           }
  //           axios
  //             .post("http://localhost:4000/api/threshold/check", article)
  //             .then((response) => {
  //               console.log("point of attraction")
  //               console.log("point of attraction")

  //               console.log(response.data)
  //               const rfData: number[] = response.data.map(
  //                 (item: DataItem) => item.rf
  //               )

  //               const xLabels: string[] = response.data.map(
  //                 (item: DataItem) => item.start_time
  //               )

  //               setxLabels(xLabels)
  //               setData(rfData)
  //               setFilt(response.data[0])
  //               console.log("point of attraction")

  //               console.log("point of attraction")
  //             })

  //           //////////////////
  //           ///////////////////////rf
  //         }
  //       })
  //   }
  // }, [age])

  useEffect(() => {
    setAge("10")
    setOpens(true)
    setIsRealtime(true)
    console.log("device changed")
    console.log(selectedDevice)
    console.log(selectedDevice.asset_id)
    const article = { title: selectedDevice.asset_id }
    axios
      .post("http://localhost:4000/api/threshold/metrics", article)
      .then((response) => {
        console.log(response.data)
        const etData: number[] = response.data[0].result.map(
          (item: DataItem) => item.et
        )
        const xLabels: string[] = response.data[0].result.map(
          (item: DataItem) => item.start_time
        )

        setData(etData)
        setxLabels(xLabels)

        console.log("check this //////////////")
        console.log(selectedDevice?.asset_id)
        console.log(selectedDevice?.asset_name)
        console.log("check this//////////////////////")

        setLatestBp(response.data[0].latestDocumentsBp)
        setLatestEt(response.data[0].latestDocumentsEt)
        setLatestKnn(response.data[0].latestDocumentsKnn)
        setLatestRf(response.data[0].latestDocumentsRf)
        setOpens(false)
      })
  }, [selectedDevice])

  const allYLabels = Object.values(yLabels)

  // Highcharts configuration options
  const options: Highcharts.Options = {
    title: {
      text: "Metrics Status",
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      categories: xLabels, // Set x-axis labels
    },
    yAxis: {
      title: {
        text: "Status",
      },
      categories: allYLabels, // Set y-axis labels
      labels: {
        formatter: function () {
          const value = Number(this.value)
          if (!isNaN(value) && yLabels[value] !== undefined) {
            return yLabels[value]
          }
          return this.value.toString()
        },
      },
    },
    series: [
      {
        name: "Data",
        data: data,
        type: "line",
      },
    ],
  }

  //////
  const StyledIcon = styled("div")(({ theme }) => ({
    margin: "auto",
    display: "flex",
    borderRadius: "50%",
    alignItems: "center",
    width: theme.spacing(8),
    height: theme.spacing(8),
    justifyContent: "center",
    marginBottom: theme.spacing(3),
  }))

  // Example metric data (replace this with your actual data)

  ////////////////
  ////////////////
  const options1: Highcharts.Options = {
    chart: {
      type: "column",
    },
    title: {
      text: "Bar Chart Example",
    },
    xAxis: {
      categories: ["Category 1", "Category 2", "Category 3", "Category 4"],
    },
    yAxis: {
      title: {
        text: "Value",
      },
    },
    series: [
      {
        type: "bar", // Specify the series type as 'bar'
        name: "Data",
        data: [10, 25, 15, 30],
      },
    ],
  }
  ////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////
  const fetchData = () => {
    if (isRealtime) {
      /////////////////////
      /////////////////////
      ////////////////////WRITING UP THE REAL CODE
      const article = {}
      console.log("REAL DATA REAL TIME")
      axios
        .post("http://localhost:4000/api/threshold/metrics", article)
        .then((response) => {
          const etData: number[] = response.data[0].result.map(
            (item: DataItem) => item.et
          )
          const rfData: number[] = response.data[0].result.map(
            (item: DataItem) => item.rf
          )
          const knnData: number[] = response.data[0].result.map(
            (item: DataItem) => item.knn
          )
          const bpData: number[] = response.data[0].result.map(
            (item: DataItem) => item.bp
          )
          const xLabels: string[] = response.data[0].result.map(
            (item: DataItem) => item.start_time
          )
          if (age == " 10") {
            setData(etData)
            setxLabels(xLabels)
          } else if (age == "20") {
            setData(knnData)
            setxLabels(xLabels)
          } else if (age == "30") {
            setData(rfData)
            setxLabels(xLabels)
          } else if (age == "40") {
            setData(bpData)
            setxLabels(xLabels)
          }
          setMyObject(response.data[0].startObject)
          setLatestBp(response.data[0].latestDocumentsBp)
          setLatestEt(response.data[0].latestDocumentsEt)
          setLatestKnn(response.data[0].latestDocumentsKnn)
          setLatestRf(response.data[0].latestDocumentsRf)
        })
        .catch((error) => {
          console.error("Error fetching data:", error)
        })
      //////////////////////WRITING UP THE REAL CODE
      /////////////////////
      ///////////////
    } else {
      //pass
    }
  }

  useEffect(() => {
    // Fetch data immediately when the component mounts
    fetchData()

    // Set up an interval to fetch data every 60 seconds
    const intervalId = setInterval(() => {
      fetchData()
    }, 60000)

    // Clear the interval when the component unmounts
    return () => {
      clearInterval(intervalId)
    }
  }, [])

  const {
    tw_startTime: startTime,
    tw_endTime: endTime,
    set_tw_StartTime: setStartTime,
    set_tw_EndTime: setEndTime,
  } = useTimeStore()
  ///////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////

  return (
    <div className="h-screen relative overflow-hidden flex flex-row justify-start bg-bodyBgGrey1">
      <div className="w-full overflow-y-scroll ml-20">
        <div className="px-7">
          <div>
            <div className="flex flex-col gap-3 mt-16">
              <div className="flex items-center gap-5 pl-2 z-10">
                <div className="flex items-center gap-2.5">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      label="Date&Time picker"
                      value={startTime}
                      inputFormat="DD/MM/YYYY hh:mm A"
                      onChange={(value) => {
                        //@ts-ignore
                        if (moment(value?.$d).isBefore(endTime)) {
                          //@ts-ignore
                          setStartTime(moment(value?.$d).format())
                          //@ts-ignore
                        } else {
                          showNotification({
                            title: "User notification",
                            message: "Start_ts can't be greater than end_ts !",
                            autoClose: 2500,
                            styles: () => ({
                              root: {
                                width: "300px",
                                padding: "12.5px 5px 20px 22px",
                                "&::before": {
                                  backgroundColor: "rgb(255, 193, 7)",
                                },
                              },
                            }),
                          })
                        }
                      }}
                      renderInput={({ inputRef, inputProps, InputProps }) => (
                        <Box
                          sx={{ display: "flex", alignItems: "center" }}
                          className="shadow py-3 px-4 border rounded"
                        >
                          <input
                            ref={inputRef}
                            {...inputProps}
                            style={{
                              border: "none",
                              outline: "none",
                              width: "155px",
                            }}
                          />
                          {InputProps?.endAdornment}
                        </Box>
                      )}
                    />
                  </LocalizationProvider>
                </div>

                <div className="flex items-center gap-2.5">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      label="Date&Time picker"
                      value={endTime}
                      inputFormat="DD/MM/YYYY hh:mm A"
                      onChange={(value) => {
                        //@ts-ignore
                        if (moment(value?.$d).isAfter(startTime)) {
                          //@ts-ignore
                          setEndTime(moment(value?.$d).format())
                          //@ts-ignore
                        } else {
                          showNotification({
                            title: "User notification",
                            message: "End_ts can't be lesss than start_ts !",
                            autoClose: 2500,
                            styles: () => ({
                              root: {
                                width: "300px",
                                padding: "12.5px 5px 20px 22px",
                                "&::before": {
                                  backgroundColor: "rgb(255, 193, 7)",
                                },
                              },
                            }),
                          })
                        }
                      }}
                      renderInput={({ inputRef, inputProps, InputProps }) => (
                        <Box
                          sx={{ display: "flex", alignItems: "center" }}
                          className="shadow py-3 px-4 border rounded"
                        >
                          <input
                            ref={inputRef}
                            {...inputProps}
                            style={{
                              border: "none",
                              outline: "none",
                              width: "155px",
                            }}
                          />
                          {InputProps?.endAdornment}
                        </Box>
                      )}
                    />
                  </LocalizationProvider>
                </div>
                <Tooltip
                  title="Refetch"
                  arrow
                  classes={{
                    tooltip: "bg-gray-200 text-black",
                    arrow: "text-gray-200",
                  }}
                >
                  <Button
                    onClick={() => {
                      console.log("clicked button")
                      setIsRealtime(false)
                      setAge("10")
                      console.log(filt)
                      const article = {
                        title: selectedDevice?.asset_id,
                        startDate: startTime,
                        endDate: endTime,
                      }
                      axios
                        .post(
                          "http://localhost:4000/api/threshold/check",
                          article
                        )
                        .then((response) => {
                          console.log("point of attraction")
                          console.log("point of attraction")

                          console.log(response.data)
                          const etData: number[] = response.data.map(
                            (item: DataItem) => item.et
                          )

                          const xLabels: string[] = response.data.map(
                            (item: DataItem) => item.start_time
                          )

                          setxLabels(xLabels)
                          setData(etData)
                          console.log(etData)
                          setFilt(response.data[0])
                          console.log("point of attraction")

                          console.log("point of attraction")
                        })
                    }}
                  >
                    <RefreshOutlinedIcon />
                  </Button>
                </Tooltip>
                <FormControlLabel
                  className="relative right-1"
                  classes={{
                    label: `font-semibold ${
                      isRealtime
                        ? "text-gray-500"
                        : "text-gray-400 transition-all"
                    }`,
                  }}
                  control={
                    <Switch
                      checked={isRealtime}
                      onChange={(e) => setIsRealtime(e.target.checked)}
                      classes={{ track: "bg-infoCardDarkGreen" }}
                      size="medium"
                    />
                  }
                  label="Realtime"
                />
              </div>
            </div>

            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <InputLabel id="demo-select-small-label">Model</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={age}
                label="Model"
                onChange={change}
              >
                <MenuItem value={"10"}>
                  <em>ET</em>
                </MenuItem>
                <MenuItem value={"20"}>KNN</MenuItem>
                <MenuItem value={"40"}>BEST PREDICTION</MenuItem>
                <MenuItem value={"30"}>RF</MenuItem>
              </Select>
            </FormControl>
            <HighchartsReact highcharts={Highcharts} options={options} />
            <OptionsDrawer />
            <br />
            <Box sx={{ minWidth: 275 }}>
              <Card variant="outlined">{card}</Card>
            </Box>
            <br />
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <MetricCard //1111111111
                  title="Exhauster-1 Motor Drive End"
                  value={1200}
                  unit="units"
                  color={
                    myObject["6d7f45c0-3039-11ed-81ef-d732cfd46ac3"] === 0
                      ? "#2e8545"
                      : myObject["6d7f45c0-3039-11ed-81ef-d732cfd46ac3"] === 1
                      ? "#ba8950"
                      : myObject["6d7f45c0-3039-11ed-81ef-d732cfd46ac3"] === 2
                      ? "#de381f"
                      : "#007BFF"
                  }
                  trend="up"
                  et={latestEt["6d7f45c0-3039-11ed-81ef-d732cfd46ac3"]}
                  knn={latestKnn["6d7f45c0-3039-11ed-81ef-d732cfd46ac3"]}
                  rf={latestRf["6d7f45c0-3039-11ed-81ef-d732cfd46ac3"]}
                  best={latestBp["6d7f45c0-3039-11ed-81ef-d732cfd46ac3"]}
                />
              </Grid>
              <Grid item xs={3}>
                <MetricCard //22222222
                  title="Exhauster-1 Motor Non-Drive End"
                  value={1200}
                  unit="units"
                  color={
                    myObject["6d7f93e0-3039-11ed-81ef-d732cfd46ac3"] === 0
                      ? "#2e8545"
                      : myObject["6d7f93e0-3039-11ed-81ef-d732cfd46ac3"] === 1
                      ? "#ba8950"
                      : myObject["6d7f93e0-3039-11ed-81ef-d732cfd46ac3"] === 2
                      ? "#de381f"
                      : "#007BFF"
                  }
                  trend="up"
                  et={latestEt["6d7f93e0-3039-11ed-81ef-d732cfd46ac3"]}
                  knn={latestKnn["6d7f93e0-3039-11ed-81ef-d732cfd46ac3"]}
                  rf={latestRf["6d7f93e0-3039-11ed-81ef-d732cfd46ac3"]}
                  best={latestBp["6d7f93e0-3039-11ed-81ef-d732cfd46ac3"]}
                />
              </Grid>
              <Grid item xs={3}>
                <MetricCard ////333333333
                  title="Exhauster-1 Fan Drive End"
                  value={1200}
                  unit="units"
                  color={
                    myObject["6d7ea981-3039-11ed-81ef-d732cfd46ac3"] === 0
                      ? "#2e8545"
                      : myObject["6d7ea981-3039-11ed-81ef-d732cfd46ac3"] === 1
                      ? "#ba8950"
                      : myObject["6d7ea981-3039-11ed-81ef-d732cfd46ac3"] === 2
                      ? "#de381f"
                      : "#007BFF"
                  }
                  trend="up"
                  et={latestEt["6d7ea981-3039-11ed-81ef-d732cfd46ac3"]}
                  knn={latestKnn["6d7ea981-3039-11ed-81ef-d732cfd46ac3"]}
                  rf={latestRf["6d7ea981-3039-11ed-81ef-d732cfd46ac3"]}
                  best={latestBp["6d7ea981-3039-11ed-81ef-d732cfd46ac3"]}
                />
              </Grid>
              <Grid item xs={3}>
                <MetricCard //////44444444
                  title="Exhauster-1 Fan Non-Drive End"
                  value={1200}
                  unit="units"
                  color={
                    myObject["6d7ea982-3039-11ed-81ef-d732cfd46ac3"] === 0
                      ? "#2e8545"
                      : myObject["6d7ea982-3039-11ed-81ef-d732cfd46ac3"] === 1
                      ? "#ba8950"
                      : myObject["6d7ea982-3039-11ed-81ef-d732cfd46ac3"] === 2
                      ? "#de381f"
                      : "#007BFF"
                  }
                  trend="up"
                  et={latestEt["6d7ea982-3039-11ed-81ef-d732cfd46ac3"]}
                  knn={latestKnn["6d7ea982-3039-11ed-81ef-d732cfd46ac3"]}
                  rf={latestRf["6d7ea982-3039-11ed-81ef-d732cfd46ac3"]}
                  best={latestBp["6d7ea982-3039-11ed-81ef-d732cfd46ac3"]}
                />
              </Grid>
              <Grid item xs={3}>
                <MetricCard
                  title="Exhauster-2 Motor Drive End"
                  value={1200}
                  unit="units"
                  color={
                    myObject["6d8f7261-3039-11ed-81ef-d732cfd46ac3"] === 0
                      ? "#2e8545"
                      : myObject["6d8f7261-3039-11ed-81ef-d732cfd46ac3"] === 1
                      ? "#ba8950"
                      : myObject["6d8f7261-3039-11ed-81ef-d732cfd46ac3"] === 2
                      ? "#de381f"
                      : "#007BFF"
                  }
                  trend="up"
                  et={latestEt["6d8f7261-3039-11ed-81ef-d732cfd46ac3"]}
                  knn={latestKnn["6d8f7261-3039-11ed-81ef-d732cfd46ac3"]}
                  rf={latestRf["6d8f7261-3039-11ed-81ef-d732cfd46ac3"]}
                  best={latestBp["6d8f7261-3039-11ed-81ef-d732cfd46ac3"]}
                />
              </Grid>
              <Grid item xs={3}>
                <MetricCard
                  title="Exhauster-2 Motor Non-Drive End"
                  value={1200}
                  unit="units"
                  color={
                    myObject["6d7ea980-3039-11ed-81ef-d732cfd46ac3"] === 0
                      ? "#2e8545"
                      : myObject["6d7ea980-3039-11ed-81ef-d732cfd46ac3"] === 1
                      ? "#ba8950"
                      : myObject["6d7ea980-3039-11ed-81ef-d732cfd46ac3"] === 2
                      ? "#de381f"
                      : "#007BFF"
                  }
                  trend="up"
                  et={latestEt["6d7ea980-3039-11ed-81ef-d732cfd46ac3"]}
                  knn={latestKnn["6d7ea980-3039-11ed-81ef-d732cfd46ac3"]}
                  rf={latestRf["6d7ea980-3039-11ed-81ef-d732cfd46ac3"]}
                  best={latestBp["6d7ea980-3039-11ed-81ef-d732cfd46ac3"]}
                />
              </Grid>
              <Grid item xs={3}>
                <MetricCard
                  title="Exhauster-2 Fan Drive End"
                  value={1200}
                  unit="units"
                  color={
                    myObject["6d7f45c2-3039-11ed-81ef-d732cfd46ac3"] === 0
                      ? "#2e8545"
                      : myObject["6d7f45c2-3039-11ed-81ef-d732cfd46ac3"] === 1
                      ? "#ba8950"
                      : myObject["6d7f45c2-3039-11ed-81ef-d732cfd46ac3"] === 2
                      ? "#de381f"
                      : "#007BFF"
                  }
                  trend="up"
                  et={latestEt["6d7f45c2-3039-11ed-81ef-d732cfd46ac3"]}
                  knn={latestKnn["6d7f45c2-3039-11ed-81ef-d732cfd46ac3"]}
                  rf={latestRf["6d7f45c2-3039-11ed-81ef-d732cfd46ac3"]}
                  best={latestBp["6d7f45c2-3039-11ed-81ef-d732cfd46ac3"]}
                />
              </Grid>
              <Grid item xs={3}>
                <MetricCard
                  title="Exhauster-2 Fan Non-Drive End"
                  value={1200}
                  unit="units"
                  color={
                    myObject["6d7f45c1-3039-11ed-81ef-d732cfd46ac3"] === 0
                      ? "#2e8545"
                      : myObject["6d7f45c1-3039-11ed-81ef-d732cfd46ac3"] === 1
                      ? "#ba8950"
                      : myObject["6d7f45c1-3039-11ed-81ef-d732cfd46ac3"] === 2
                      ? "#de381f"
                      : "#007BFF"
                  }
                  trend="up"
                  et={latestEt["6d7f45c1-3039-11ed-81ef-d732cfd46ac3"]}
                  knn={latestKnn["6d7f45c1-3039-11ed-81ef-d732cfd46ac3"]}
                  rf={latestRf["6d7f45c1-3039-11ed-81ef-d732cfd46ac3"]}
                  best={latestBp["6d7f45c1-3039-11ed-81ef-d732cfd46ac3"]}
                />
              </Grid>
              <Grid item xs={3}>
                <MetricCard
                  title="Exhauster-3 Motor Drive End"
                  value={1200}
                  unit="units"
                  color={
                    myObject["6d8a1b31-3039-11ed-81ef-d732cfd46ac3"] === 0
                      ? "#2e8545"
                      : myObject["6d8a1b31-3039-11ed-81ef-d732cfd46ac3"] === 1
                      ? "#ba8950"
                      : myObject["6d8a1b31-3039-11ed-81ef-d732cfd46ac3"] === 2
                      ? "#de381f"
                      : "#007BFF"
                  }
                  trend="up"
                  et={latestEt["6d8a1b31-3039-11ed-81ef-d732cfd46ac3"]}
                  knn={latestKnn["6d8a1b31-3039-11ed-81ef-d732cfd46ac3"]}
                  rf={latestRf["6d8a1b31-3039-11ed-81ef-d732cfd46ac3"]}
                  best={latestBp["6d8a1b31-3039-11ed-81ef-d732cfd46ac3"]}
                />
              </Grid>{" "}
              <Grid item xs={3}>
                <MetricCard
                  title="Exhauster-3 Motor Non-Drive End"
                  value={1200}
                  unit="units"
                  color={
                    myObject["6d8a6950-3039-11ed-81ef-d732cfd46ac3"] === 0
                      ? "#2e8545"
                      : myObject["6d8a6950-3039-11ed-81ef-d732cfd46ac3"] === 1
                      ? "#ba8950"
                      : myObject["6d8a6950-3039-11ed-81ef-d732cfd46ac3"] === 2
                      ? "#de381f"
                      : "#007BFF"
                  }
                  trend="up"
                  et={latestEt["6d8a6950-3039-11ed-81ef-d732cfd46ac3"]}
                  knn={latestKnn["6d8a6950-3039-11ed-81ef-d732cfd46ac3"]}
                  rf={latestRf["6d8a6950-3039-11ed-81ef-d732cfd46ac3"]}
                  best={latestBp["6d8a6950-3039-11ed-81ef-d732cfd46ac3"]}
                />
              </Grid>
              <Grid item xs={3}>
                <MetricCard
                  title="Exhauster-3 Fan Drive End"
                  value={1200}
                  unit="units"
                  color={
                    myObject["6d8b7ac0-3039-11ed-81ef-d732cfd46ac3"] === 0
                      ? "#2e8545"
                      : myObject["6d8b7ac0-3039-11ed-81ef-d732cfd46ac3"] === 1
                      ? "#ba8950"
                      : myObject["6d8b7ac0-3039-11ed-81ef-d732cfd46ac3"] === 2
                      ? "#de381f"
                      : "#007BFF"
                  }
                  trend="up"
                  et={latestEt["6d8b7ac0-3039-11ed-81ef-d732cfd46ac3"]}
                  knn={latestKnn["6d8b7ac0-3039-11ed-81ef-d732cfd46ac3"]}
                  rf={latestRf["6d8b7ac0-3039-11ed-81ef-d732cfd46ac3"]}
                  best={latestBp["6d8b7ac0-3039-11ed-81ef-d732cfd46ac3"]}
                />
              </Grid>
              <Grid item xs={3}>
                <MetricCard
                  title="Exhauster-3 Fan Non-Drive End"
                  value={1200}
                  unit="units"
                  color={
                    myObject["6d8a4240-3039-11ed-81ef-d732cfd46ac3"] === 0
                      ? "#2e8545"
                      : myObject["6d8a4240-3039-11ed-81ef-d732cfd46ac3"] === 1
                      ? "#ba8950"
                      : myObject["6d8a4240-3039-11ed-81ef-d732cfd46ac3"] === 2
                      ? "#de381f"
                      : "#007BFF"
                  }
                  trend="up"
                  et={latestEt["6d8a4240-3039-11ed-81ef-d732cfd46ac3"]}
                  knn={latestKnn["6d8a4240-3039-11ed-81ef-d732cfd46ac3"]}
                  rf={latestRf["6d8a4240-3039-11ed-81ef-d732cfd46ac3"]}
                  best={latestBp["6d8a4240-3039-11ed-81ef-d732cfd46ac3"]}
                />
              </Grid>
              <Grid item xs={3}>
                <MetricCard
                  title="Exhauster-4 Motor Drive End"
                  value={1200}
                  unit="units"
                  color={
                    myObject["6d8a4241-3039-11ed-81ef-d732cfd46ac3"] === 0
                      ? "#2e8545"
                      : myObject["6d8a4241-3039-11ed-81ef-d732cfd46ac3"] === 1
                      ? "#ba8950"
                      : myObject["6d8a4241-3039-11ed-81ef-d732cfd46ac3"] === 2
                      ? "#de381f"
                      : "#007BFF"
                  }
                  trend="up"
                  et={latestEt["6d8a4241-3039-11ed-81ef-d732cfd46ac3"]}
                  knn={latestKnn["6d8a4241-3039-11ed-81ef-d732cfd46ac3"]}
                  rf={latestRf["6d8a4241-3039-11ed-81ef-d732cfd46ac3"]}
                  best={latestBp["6d8a4241-3039-11ed-81ef-d732cfd46ac3"]}
                />
              </Grid>
              <Grid item xs={3}>
                <MetricCard
                  title="Exhauster-4 Motor Non-Drive End"
                  value={1200}
                  unit="units"
                  color={
                    myObject["6d8a1b30-3039-11ed-81ef-d732cfd46ac3"] === 0
                      ? "#2e8545"
                      : myObject["6d8a1b30-3039-11ed-81ef-d732cfd46ac3"] === 1
                      ? "#ba8950"
                      : myObject["6d8a1b30-3039-11ed-81ef-d732cfd46ac3"] === 2
                      ? "#de381f"
                      : "#007BFF"
                  }
                  trend="up"
                  et={latestEt["6d8a1b30-3039-11ed-81ef-d732cfd46ac3"]}
                  knn={latestKnn["6d8a1b30-3039-11ed-81ef-d732cfd46ac3"]}
                  rf={latestRf["6d8a1b30-3039-11ed-81ef-d732cfd46ac3"]}
                  best={latestBp["6d8a1b30-3039-11ed-81ef-d732cfd46ac3"]}
                />
              </Grid>
              <Grid item xs={3}>
                <MetricCard
                  title="Exhauster-4 Fan Drive End"
                  value={1200}
                  unit="units"
                  color={
                    myObject["6d8a1b33-3039-11ed-81ef-d732cfd46ac3"] === 0
                      ? "#2e8545"
                      : myObject["6d8a1b33-3039-11ed-81ef-d732cfd46ac3"] === 1
                      ? "#ba8950"
                      : myObject["6d8a1b33-3039-11ed-81ef-d732cfd46ac3"] === 2
                      ? "#de381f"
                      : "#007BFF"
                  }
                  trend="up"
                  et={latestEt["6d8a1b33-3039-11ed-81ef-d732cfd46ac3"]}
                  knn={latestKnn["6d8a1b33-3039-11ed-81ef-d732cfd46ac3"]}
                  rf={latestRf["6d8a1b33-3039-11ed-81ef-d732cfd46ac3"]}
                  best={latestBp["6d8a1b33-3039-11ed-81ef-d732cfd46ac3"]}
                />
              </Grid>
              <Grid item xs={3}>
                <MetricCard
                  title="Exhauster-4 Fan Non-Drive End"
                  value={1200}
                  unit="units"
                  color={
                    myObject["6d8a1b32-3039-11ed-81ef-d732cfd46ac3"] === 0
                      ? "#2e8545"
                      : myObject["6d8a1b32-3039-11ed-81ef-d732cfd46ac3"] === 1
                      ? "#ba8950"
                      : myObject["6d8a1b32-3039-11ed-81ef-d732cfd46ac3"] === 2
                      ? "#de381f"
                      : "#007BFF"
                  }
                  trend="up"
                  et={latestEt["6d8a1b32-3039-11ed-81ef-d732cfd46ac3"]}
                  knn={latestKnn["6d8a1b32-3039-11ed-81ef-d732cfd46ac3"]}
                  rf={latestRf["6d8a1b32-3039-11ed-81ef-d732cfd46ac3"]}
                  best={latestBp["6d8a1b32-3039-11ed-81ef-d732cfd46ac3"]}
                />
              </Grid>
              <Grid item xs={3}>
                <MetricCard
                  title="Exhauster-5 Motor Drive End"
                  value={1200}
                  unit="units"
                  color={
                    myObject["6d8f4b50-3039-11ed-81ef-d732cfd46ac3"] === 0
                      ? "#2e8545"
                      : myObject["6d8f4b50-3039-11ed-81ef-d732cfd46ac3"] === 1
                      ? "#ba8950"
                      : myObject["6d8f4b50-3039-11ed-81ef-d732cfd46ac3"] === 2
                      ? "#de381f"
                      : "#007BFF"
                  }
                  trend="up"
                  et={latestEt["6d8f4b50-3039-11ed-81ef-d732cfd46ac3"]}
                  knn={latestKnn["6d8f4b50-3039-11ed-81ef-d732cfd46ac3"]}
                  rf={latestRf["6d8f4b50-3039-11ed-81ef-d732cfd46ac3"]}
                  best={latestBp["6d8f4b50-3039-11ed-81ef-d732cfd46ac3"]}
                />
              </Grid>
              <Grid item xs={3}>
                <MetricCard
                  title="Exhauster-5 Motor Non-Drive End"
                  value={1200}
                  unit="units"
                  color={
                    myObject["6d8fc080-3039-11ed-81ef-d732cfd46ac3"] === 0
                      ? "#2e8545"
                      : myObject["6d8fc080-3039-11ed-81ef-d732cfd46ac3"] === 1
                      ? "#ba8950"
                      : myObject["6d8fc080-3039-11ed-81ef-d732cfd46ac3"] === 2
                      ? "#de381f"
                      : "#007BFF"
                  }
                  trend="up"
                  et={latestEt["6d8fc080-3039-11ed-81ef-d732cfd46ac3"]}
                  knn={latestKnn["6d8fc080-3039-11ed-81ef-d732cfd46ac3"]}
                  rf={latestRf["6d8fc080-3039-11ed-81ef-d732cfd46ac3"]}
                  best={latestBp["6d8fc080-3039-11ed-81ef-d732cfd46ac3"]}
                />
              </Grid>
              <Grid item xs={3}>
                <MetricCard
                  title="Exhauster-5 Fan Drive End"
                  value={1200}
                  unit="units"
                  color={
                    myObject["6d973a90-3039-11ed-81ef-d732cfd46ac3"] === 0
                      ? "#2e8545"
                      : myObject["6d973a90-3039-11ed-81ef-d732cfd46ac3"] === 1
                      ? "#ba8950"
                      : myObject["6d973a90-3039-11ed-81ef-d732cfd46ac3"] === 2
                      ? "#de381f"
                      : "#007BFF"
                  }
                  trend="up"
                  et={latestEt["6d973a90-3039-11ed-81ef-d732cfd46ac3"]}
                  knn={latestKnn["6d973a90-3039-11ed-81ef-d732cfd46ac3"]}
                  rf={latestRf["6d973a90-3039-11ed-81ef-d732cfd46ac3"]}
                  best={latestBp["6d973a90-3039-11ed-81ef-d732cfd46ac3"]}
                />
              </Grid>
              <Grid item xs={3}>
                <MetricCard
                  title="Exhauster-5 Fan Non-Drive End"
                  value={1200}
                  unit="units"
                  color={
                    myObject["6d8e8800-3039-11ed-81ef-d732cfd46ac3"] === 0
                      ? "#2e8545"
                      : myObject["6d8e8800-3039-11ed-81ef-d732cfd46ac3"] === 1
                      ? "#ba8950"
                      : myObject["6d8e8800-3039-11ed-81ef-d732cfd46ac3"] === 2
                      ? "#de381f"
                      : "#007BFF"
                  }
                  trend="up"
                  et={latestEt["6d8e8800-3039-11ed-81ef-d732cfd46ac3"]}
                  knn={latestKnn["6d8e8800-3039-11ed-81ef-d732cfd46ac3"]}
                  rf={latestRf["6d8e8800-3039-11ed-81ef-d732cfd46ac3"]}
                  best={latestBp["6d8e8800-3039-11ed-81ef-d732cfd46ac3"]}
                />
              </Grid>
              <Grid item xs={3}>
                <MetricCard
                  title="Exhauster-6 Motor Drive End"
                  value={1200}
                  unit="units"
                  color={
                    myObject["6d8fe790-3039-11ed-81ef-d732cfd46ac3"] === 0
                      ? "#2e8545"
                      : myObject["6d8fe790-3039-11ed-81ef-d732cfd46ac3"] === 1
                      ? "#ba8950"
                      : myObject["6d8fe790-3039-11ed-81ef-d732cfd46ac3"] === 2
                      ? "#de381f"
                      : "#007BFF"
                  }
                  trend="up"
                  et={latestEt["6d8fe790-3039-11ed-81ef-d732cfd46ac3"]}
                  knn={latestKnn["6d8fe790-3039-11ed-81ef-d732cfd46ac3"]}
                  rf={latestRf["6d8fe790-3039-11ed-81ef-d732cfd46ac3"]}
                  best={latestBp["6d8fe790-3039-11ed-81ef-d732cfd46ac3"]}
                />
              </Grid>
              <Grid item xs={3}>
                <MetricCard
                  title="Exhauster-6 Motor Non-Drive End"
                  value={1200}
                  unit="units"
                  color={
                    myObject["6d9083d0-3039-11ed-81ef-d732cfd46ac3"] === 0
                      ? "#2e8545"
                      : myObject["6d9083d0-3039-11ed-81ef-d732cfd46ac3"] === 1
                      ? "#ba8950"
                      : myObject["6d9083d0-3039-11ed-81ef-d732cfd46ac3"] === 2
                      ? "#de381f"
                      : "#007BFF"
                  }
                  trend="up"
                  et={latestEt["6d9083d0-3039-11ed-81ef-d732cfd46ac3"]}
                  knn={latestKnn["6d9083d0-3039-11ed-81ef-d732cfd46ac3"]}
                  rf={latestRf["6d9083d0-3039-11ed-81ef-d732cfd46ac3"]}
                  best={latestBp["6d9083d0-3039-11ed-81ef-d732cfd46ac3"]}
                />
              </Grid>
              <Grid item xs={3}>
                <MetricCard
                  title="Exhauster-6 Fan Drive End"
                  value={1200}
                  unit="units"
                  color={
                    myObject["6d8fe791-3039-11ed-81ef-d732cfd46ac3"] === 0
                      ? "#2e8545"
                      : myObject["6d8fe791-3039-11ed-81ef-d732cfd46ac3"] === 1
                      ? "#ba8950"
                      : myObject["6d8fe791-3039-11ed-81ef-d732cfd46ac3"] === 2
                      ? "#de381f"
                      : "#007BFF"
                  }
                  trend="up"
                  et={latestEt["6d8fe791-3039-11ed-81ef-d732cfd46ac3"]}
                  knn={latestKnn["6d8fe791-3039-11ed-81ef-d732cfd46ac3"]}
                  rf={latestRf["6d8fe791-3039-11ed-81ef-d732cfd46ac3"]}
                  best={latestBp["6d8fe791-3039-11ed-81ef-d732cfd46ac3"]}
                />
              </Grid>
              <Grid item xs={3}>
                <MetricCard
                  title="Exhauster-6 Fan Non-Drive End"
                  value={1200}
                  unit="units"
                  color={
                    myObject["6d9083d1-3039-11ed-81ef-d732cfd46ac3"] === 0
                      ? "#2e8545"
                      : myObject["6d9083d1-3039-11ed-81ef-d732cfd46ac3"] === 1
                      ? "#ba8950"
                      : myObject["6d9083d1-3039-11ed-81ef-d732cfd46ac3"] === 2
                      ? "#de381f"
                      : "#007BFF"
                  }
                  trend="up"
                  et={latestEt["6d9083d1-3039-11ed-81ef-d732cfd46ac3"]}
                  knn={latestKnn["6d9083d1-3039-11ed-81ef-d732cfd46ac3"]}
                  rf={latestRf["6d9083d1-3039-11ed-81ef-d732cfd46ac3"]}
                  best={latestBp["6d9083d1-3039-11ed-81ef-d732cfd46ac3"]}
                />
              </Grid>
            </Grid>
            <Modal
              open={opens}
              aria-labelledby="parent-modal-title"
              aria-describedby="parent-modal-description"
            >
              <Box sx={{ ...style, width: 400 }}>
                <LinearProgress
                  variant="buffer"
                  value={progress}
                  valueBuffer={buffer}
                />
              </Box>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Metrics
