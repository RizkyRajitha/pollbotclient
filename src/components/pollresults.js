import {
  Box,
  Heading,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { PieChart } from "react-minimal-pie-chart";
import { postApi } from "../util/fetch";

export default function PollResults({ pollId, session, reload }) {
  const [pollResultsData, setpollResultsData] = useState([]);
  const [pollData, setpollData] = useState(null);
  const [pieDiagramData, setpieDiagramData] = useState([]);
  const [pollResultsDataByOptions, setPollResultsByOptions] = useState([]);

  // user breakdown modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  //error diaslog
  const [isErrorOpen, setIsErrorOpen] = React.useState(false);
  const [errorMsg, seterrorMsg] = React.useState("");
  const onErrorClose = () => setIsErrorOpen(false);
  const cancelRef = React.useRef();

  // loading
  const [isEndPollLoading, setIsEndPollLoading] = React.useState(false);
  const [isDeleteollLoading, setIsDeleteollLoading] = React.useState(false);

  useEffect(() => {
    const resultsSubscription = supabase
      .from(`results:pollId=eq.${pollId}`)
      .on("*", async (payload) => {
        // console.log("Change received!", payload);

        // console.log(pollData);
        // console.log(pollResultsData);

        // set data for first time
        if (payload.new.pollId !== pollId) {
          console.log("invalid poll!");

          return;
        }

        // set first result
        if (pollResultsData.length === 0) {
          let pollRes = [
            {
              id: payload.new.id,
              discordUsername: payload.new.discordUsername,
              selections: payload.new.selections,
              pollId: payload.new.pollId,
            },
          ];
          setpollResultsData(pollRes);
          return;
        }
        let tempdata = [...pollResultsData];
        console.log(pollResultsData);
        for (let index = 0; index < pollResultsData.length; index++) {
          // pollResultsData.forEach((element, index) => {

          const element = pollResultsData[index];

          // console.log(element.pollId);
          // console.log(payload.new.pollId);
          if (element.pollId !== payload.new.pollId) {
            console.log("invalid poll! - for");
            continue;
          }
          if (element.id === payload.new.id) {
            console.log("updated");
            tempdata[index].discordUsername = payload.new.discordUsername;
            tempdata[index].id = payload.new.id;
            tempdata[index].selections = payload.new.selections;
            tempdata[index].pollId = payload.new.pollId;
          } else {
            tempdata.push({
              discordUsername: payload.new.discordUsername,
              id: payload.new.id,
              selections: payload.new.selections,
              pollId: payload.new.pollId,
            });
          }
        }

        // console.log(tempdata);
        setpollResultsData(tempdata);
      })
      .subscribe();
    console.log("Change subscribe! " + pollId);

    return () => {
      resultsSubscription
        .unsubscribe()
        .receive("ok", () => console.log("unsubscribed! " + pollId));
    };
  }, [pollId, pollData, pollResultsData]);

  const fetchPolls = async () => {
    let { data: polldata, error: pollerror } = await supabase
      .from("polls")
      .select("*")
      .eq("id", pollId)
      .single();

    if (pollerror) {
      console.log(pollerror);
      setIsErrorOpen(true);
      seterrorMsg(pollerror.message);
      return;
    }
    // console.log("poll data");

    // console.log(polldata);
    setpollData(polldata);
  };

  const fetchPollResults = async () => {
    let { data, error } = await supabase
      .from("results")
      .select("discordUsername,selections,id,pollId")
      .eq("pollId", pollId);

    if (error) {
      console.log(error);
      setIsErrorOpen(true);
      seterrorMsg(error.message);
      return;
    }
    // console.log("results data");
    // console.log(data);
    setpollResultsData(data);
  };

  // fetch latest results from the supabase on mount
  useEffect(() => {
    setpollData({});
    setpollResultsData([]);
    const fetchResults = async () => {
      await fetchPolls();
      await fetchPollResults();
    };

    fetchResults();
  }, [pollId]);

  // // set formated results for pie graph and table
  // useEffect(() => {
  //   if (!pollData) {
  //     return;
  //   }

  //   let obj = {};

  //   let options = JSON.parse(pollData?.options).map((ele) => ele.value);
  //   console.log(options);

  //   options.forEach((element, index) => {
  //     obj[element] = 0;
  //   });

  //   // for (let index = 0; index < options.length; index++) {}

  //   pollResultsData.forEach((ele) => {
  //     for (let index = 0; index < options.length; index++) {
  //       const element = options[index];
  //       console.log(element);
  //       if (ele.selections[0] === element) {
  //         obj[element] = obj[element] + 1;
  //       }
  //     }
  //   });

  //   console.log(obj);
  //   let pieDiagramDatatmp = [];
  //   let colorList = [
  //     "#E38627",
  //     "#C13C37",
  //     "#C53030",
  //     "#ED8936",
  //     "#68D391",
  //     "#38B2AC",
  //     "#3182ce",
  //   ];

  //   Object.keys(obj).forEach((element, index) => {
  //     if (obj[element] !== 0) {
  //       pieDiagramDatatmp.push({
  //         title: String(element).split("_").slice(0, -1).join(" "),
  //         value: obj[element],
  //         color: colorList[index],
  //       });
  //     }
  //   });

  //   console.log(pieDiagramDatatmp);
  //   setPollResultsByOptions(obj);
  //   setpieDiagramData(pieDiagramDatatmp);
  // }, [pollId, pollResultsData]);

  // set formated results for pie graph and table
  useEffect(() => {
    let obj = {};

    pollResultsData.forEach((ele) => {
      let vals = [...ele.selections];
      console.log(vals);
      vals.sort((a, b) => a.localeCompare(b));
      console.log(vals);
      let sel = vals.join("-");
      if (obj[sel]) {
        obj[sel] = obj[sel] + 1;
      } else {
        obj[sel] = 1;
      }
    });

    let pieDiagramDatatmp = [];
    let options = [];
    let colorList = [
      "#E38627",
      "#C13C37",
      "#C53030",
      "#ED8936",
      "#68D391",
      "#38B2AC",
      "#3182ce",
    ];

    Object.keys(obj).forEach((element, index) => {
      console.log("element - ", element);

      let sels = String(element).split("-");
      if (sels.length > 1) {
        let votesel = sels.map((ele) => {
          return String(ele).split("_").slice(0, -1)[0];
        });
        console.log(votesel);
        pieDiagramDatatmp.push({
          title: votesel.join(","),
          value: obj[element],
          color: colorList[index],
        });
        options.push({ value: obj[element], title: votesel.join(",") });
      } else {
        pieDiagramDatatmp.push({
          title: String(element).split("_").slice(0, -1),
          value: obj[element],
          color: colorList[index],
        });
        options.push({
          value: obj[element],
          title: String(element).split("_").slice(0, -1),
        });
      }
    });

    console.log(options);
    console.log(pieDiagramDatatmp);
    setPollResultsByOptions(options);
    setpieDiagramData(pieDiagramDatatmp);
  }, [pollId, pollResultsData]);

  const deletePoll = async () => {
    try {
      setIsDeleteollLoading(true);
      await postApi(
        "/v1/deletepoll",
        { pollId: pollData.id },
        session.access_token
      );
      reload();
    } catch (error) {
      setIsErrorOpen(true);
      seterrorMsg(error.message);
      return;
    } finally {
      setIsDeleteollLoading(false);
    }
  };

  const endPoll = async () => {
    try {
      setIsEndPollLoading(true);
      await postApi(
        "/v1/endpoll",
        { pollId: pollData.id },
        session.access_token
      );
      await fetchPolls();
    } catch (error) {
      setIsErrorOpen(true);
      seterrorMsg(error.message);
      return;
    } finally {
      setIsEndPollLoading(false);
    }
  };

  return (
    <Box maxW="4xl" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Box p="4">
        <Heading mb="4" mt="4">
          {`${pollData?.description ? pollData.description : ""}`}
        </Heading>
        <Box display="flex" justifyContent="space-between">
          <Box
            display="flex"
            mt="2"
            borderWidth="1px"
            borderRadius="lg"
            width="sm"
            alignItems="center"
            alignSelf="baseline"
          >
            <Table variant="simple" maxW="sm">
              <Thead>
                <Tr>
                  <Th>Option</Th>
                  <Th isNumeric>Vote</Th>
                </Tr>
              </Thead>
              <Tbody>
                {pollResultsDataByOptions &&
                  pollResultsDataByOptions.map((ele, index) => {
                    return (
                      <Tr key={index}>
                        <Td>{ele.title}</Td>
                        <Td isNumeric>{ele.value}</Td>
                      </Tr>
                    );
                  })}

                <Tr>
                  <Td color="teal">Total</Td>
                  <Td isNumeric>{pollResultsData?.length}</Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>
          <Box
            display="flex"
            mt="2"
            borderWidth="1px"
            borderRadius="lg"
            width="sm"
            alignItems="center"
            p="4"
          >
            <PieChart
              data={pieDiagramData}
              label={({ dataEntry }) => dataEntry.value}
              labelStyle={{
                fontSize: "5px",
              }}
            />
          </Box>
        </Box>
        <Flex justifyContent="end">
          {/* <Button mt={3} mr="2" onClick={fetchPollResults} colorScheme="green">
            Refresh poll
          </Button> */}
          <Button
            mt={3}
            mr="2"
            onClick={endPoll}
            colorScheme="teal"
            isLoading={isEndPollLoading}
          >
            {!pollData?.active ? "Start poll" : "End poll"}
          </Button>
          <Button
            mt={3}
            mr="2"
            onClick={deletePoll}
            colorScheme="red"
            isLoading={isDeleteollLoading}
          >
            Delete poll
          </Button>
          <Button mt={3} onClick={onOpen} colorScheme="blue">
            View vote breakdown
          </Button>
        </Flex>
      </Box>

      <Modal size="lg" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Vote breakdown</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              display="flex"
              mt="2"
              borderWidth="1px"
              borderRadius="lg"
              alignItems="center"
            >
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>User</Th>
                    <Th>Vote</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {pollResultsData &&
                    pollResultsData?.map((ele, index) => {
                      return (
                        <Tr key={index}>
                          <Td>{ele.discordUsername}</Td>
                          <Td>
                            {String(ele.selections[0])
                              .split("_")
                              .slice(0, -1)
                              .join(" ")}
                          </Td>
                        </Tr>
                      );
                    })}
                </Tbody>
              </Table>
            </Box>{" "}
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <AlertDialog
        isOpen={isErrorOpen}
        leastDestructiveRef={cancelRef}
        onClose={onErrorClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Error
            </AlertDialogHeader>
            <AlertDialogBody>{errorMsg}</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onErrorClose}>
                Close
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
