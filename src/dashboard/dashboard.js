import {
  Flex,
  Box,
  Button,
  Heading,
  Container,
  Spacer,
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
  useMediaQuery,
} from "@chakra-ui/react";
import { supabase } from "../supabaseClient";
import CreatePollModal from "../components/createnewpoll";
import AddGuildModal from "../components/addguild";
import React, { useEffect, useState } from "react";
import PollItem from "../components/pollitem";
import PollResults from "../components/pollresults";

export default function Dashboard({ session }) {
  const [pollData, setpollData] = useState([]);
  const [guildData, setguildData] = useState(null);
  const [selectedPollData, setselectedPollData] = useState(null);

  // createn poll dialog
  const { isOpen, onOpen, onClose } = useDisclosure();

  // add guild dialog
  const {
    isOpen: isOpenAddGuildModal,
    onOpen: onOpenAddGuildModal,
    onClose: onCloseAddGuildModal,
  } = useDisclosure();

  //error diaslog
  const [isErrorOpen, setIsErrorOpen] = React.useState(false);
  const [errorMsg, seterrorMsg] = React.useState("");
  const onErrorClose = () => setIsErrorOpen(false);
  const cancelRef = React.useRef();
  const [isLargerThan1280] = useMediaQuery("(min-width: 1280px)");

  useEffect(() => {
    async function fetchData() {
      let { data: guilds, error } = await supabase
        .from("guilds")
        .select("*")
        .eq("userId", session.user.id);

      if (error) {
        setIsErrorOpen(true);
        seterrorMsg(error.message);
        return;
      }
      setguildData(guilds[0]);

      // open add guild modal if no guilds are added (intended to run on forst signup)
      if (guilds?.length === 0 || !guilds) {
        onOpenAddGuildModal();
        return;
      }

      // get current polls
      let { data: polls, error: pollerror } = await supabase
        .from("polls")
        .select("*")
        .eq("userId", session.user.id)
        .order("created_at", { ascending: false });

      if (pollerror) {
        setIsErrorOpen(true);
        seterrorMsg(pollerror.message);
        return;
      }

      // console.log(polls);
      setpollData(polls);
      if (polls.length) {
        setselectedPollData(polls[0]);
      }
    }
    fetchData();
  }, [session]);

  const addGuildSuccess = async () => {
    onCloseAddGuildModal();
  };

  // fetch polls after a delete or insert
  const fetchPolls = async () => {
    let { data: polls, error: pollerror } = await supabase
      .from("polls")
      .select("*")
      .eq("userId", session.user.id)
      .order("created_at", { ascending: false });

    if (pollerror) {
      setIsErrorOpen(true);
      seterrorMsg(pollerror.message);
      return;
    }
    if (polls.length) {
      setselectedPollData(polls[0]);
    }
    // console.log(polls);
    setpollData(polls);

    if (polls.length) {
      setselectedPollData(polls[0]);
    } else {
      setselectedPollData(null);
    }
    onClose();
  };

  const setActivepoll = (index) => {
    // console.log(index);
    setselectedPollData(pollData[index]);
  };

  return (
    <Box>
      <Container minH={"100vh"} maxW="container.xl" alignItems={"center"}>
        <Flex pt="6">
          <Box p="2">
            <Heading size="md">Discord Poll Bot</Heading>
          </Box>
          <Spacer />
          <Box>
            <Button colorScheme="teal" onClick={onOpen}>
              Create Poll
            </Button>
          </Box>
        </Flex>
        {guildData && (
          <Flex pt="2">
            <Box p="2">
              <Heading size="md">
                Guild (server) id : {guildData.guildId}
              </Heading>
              <Heading size="md">{`Channel id   : ${guildData.channelId}`}</Heading>
            </Box>
            <Spacer />
          </Flex>
        )}

        <Flex
          justifyContent="space-between"
          flexDirection={isLargerThan1280 ? "row" : "column"}
        >
          <Box>
            {pollData.map((ele, index) => {
              return (
                <Box
                  w="100%"
                  // p={4}
                  pt='4'
                  pb='4'
                  onClick={() => setActivepoll(index)}
                  key={index}
                >
                  <Box
                    borderColor="teal"
                    borderRadius="lg"
                    borderWidth={
                      selectedPollData?.id === ele.id ? "2px" : "0px"
                    }
                  >
                    <PollItem pollData={ele} key={index} />
                  </Box>
                </Box>
              );
            })}
          </Box>
          <Box>
            {selectedPollData && (
              <PollResults
                pollId={selectedPollData.id}
                session={session}
                reload={fetchPolls}
              />
            )}
          </Box>
        </Flex>
        <Modal size="6xl" isOpen={isOpen} onClose={onClose} bg="#1a202c">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create new Poll</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <CreatePollModal session={session} addPollSuccess={fetchPolls} />
            </ModalBody>
            <ModalFooter>
              <Button mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal
          closeOnOverlayClick={false}
          size="xl"
          isOpen={isOpenAddGuildModal}
          onClose={onCloseAddGuildModal}
        >
          <ModalOverlay />
          <ModalContent bg="#1a202c">
            <ModalHeader>Add guild</ModalHeader>
            <ModalBody>
              <AddGuildModal
                session={session}
                addGuildSuccess={addGuildSuccess}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      </Container>
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
