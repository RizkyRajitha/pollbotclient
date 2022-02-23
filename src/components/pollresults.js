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

export default function PollResults({ pollData, session, reload }) {
  const [pollResultsData, setpollResultsData] = useState([]);
  const [pieDiagramData, setpieDiagramData] = useState([]);
  const [pollResultsDataByOptions, setPollResultsByOptions] = useState([]);

  // user breakdown modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  //error diaslog
  const [isErrorOpen, setIsErrorOpen] = React.useState(false);
  const [errorMsg, seterrorMsg] = React.useState("");
  const onErrorClose = () => setIsErrorOpen(false);
  const cancelRef = React.useRef();

  useEffect(() => {
    const resultsSubscription = supabase
      .from("results")
      .on("*", async (payload) => {
        console.log("Change received!", payload);

        if (pollResultsData.length === 0) {
          setpollResultsData([
            {
              discordUsername: payload.new.discordUsername,
              id: payload.new.id,
              selections: payload.new.selections,
            },
          ]);
          return;
        }
        let tempdata = [...pollResultsData];
        console.log(pollResultsData);
        pollResultsData.forEach((element, index) => {
          console.log(element.id);
          console.log(payload.new.id);
          if (element.id === payload.new.id) {
            console.log("updated");
            tempdata[index].discordUsername = payload.new.discordUsername;
            tempdata[index].id = payload.new.id;
            tempdata[index].selections = payload.new.selections;
          } else {
            tempdata.push({
              discordUsername: payload.new.discordUsername,
              id: payload.new.id,
              selections: payload.new.selections,
            });
          }
        });

        console.log(tempdata);
        setpollResultsData(tempdata);
      })
      .subscribe();
    console.log("Change subscribe!");

    return () => {
      resultsSubscription
        .unsubscribe()
        .receive("ok", () => console.log("left!"));
      console.log("Remove supabase subscription by useEffect unmount ");
    };
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      let { data, error } = await supabase
        .from("results")
        .select("discordUsername,selections,id")
        .eq("pollId", pollData?.id);

      if (error) {
        console.log(error);
        setIsErrorOpen(true);
        seterrorMsg(error.message);
        return;
      }
      console.log(data);
      setpollResultsData(data);
    };

    fetchResults();
  }, [pollData?.id]);

  useEffect(() => {
    console.log("update----");
    let obj = {};

    let options = JSON.parse(pollData.options).map((ele) => ele.value);
    console.log(options);
    for (let index = 0; index < options.length; index++) {
      const element = options[index];

      obj[element] = 0;
    }

    pollResultsData.forEach((ele) => {
      for (let index = 0; index < options.length; index++) {
        const element = options[index];
        console.log(element);
        if (ele.selections[0] === element) {
          obj[element] = obj[element] + 1;
        }
      }
    });
    console.log(obj);
    let pieDiagramDatatmp = [];
    let colorList = ["#E38627", "#C13C37"];

    Object.keys(obj).forEach((element, index) => {
      if (obj[element] !== 0) {
        pieDiagramDatatmp.push({
          title: element,
          value: obj[element],
          color: colorList[index],
        });
      }
    });
    console.log(pieDiagramDatatmp);
    setPollResultsByOptions(obj);
    setpieDiagramData(pieDiagramDatatmp);
  }, [pollResultsData, pollData]);

  const deletePoll = async () => {
    try {
      let res = await postApi(
        "/v1/deletepoll",
        { pollId: pollData.id },
        session.access_token
      );
      console.log(res);
      reload();
    } catch (error) {
      setIsErrorOpen(true);
      seterrorMsg(error.message);
      return;
    }
  };
  return (
    <Box maxW="4xl" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Box p="4">
        <Heading mb="4" mt="4">
          {`${pollData?.description}  ?`}
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
                  Object.keys(pollResultsDataByOptions).map((ele, index) => {
                    return (
                      <Tr>
                        <Td>{String(ele).split("_")[0]}</Td>
                        <Td isNumeric>{pollResultsDataByOptions[ele]}</Td>
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
          <Button mt={3} mr="2" onClick={deletePoll} colorScheme="blue">
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
                          <Td>{String(ele.selections[0]).split("_")[0]}</Td>
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
