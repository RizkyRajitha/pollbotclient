import {
  Flex,
  Box,
  Button,
  Heading,
  Container,
  Grid,
  GridItem,
  Spacer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { supabase } from "../supabaseClient";
import CreatePollModal from "../components/createnewpoll";
import AddGuildModal from "../components/addguild";
import { useEffect, useState } from "react";
import PollItem from "../components/pollitem";
import PollResults from "../components/pollresults";

export default function Dashboard({ session }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const [guildData, setguildData] = useState([]);
  const [pollData, setpollData] = useState([]);
  const [selectedPollData, setselectedPollData] = useState(null);
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure();

  useEffect(() => {
    console.log(session);
    async function fetchData() {
      let { data: guilds, error } = await supabase
        .from("guilds")
        .select("*")
        .eq("userId", session.user.id);
      console.log(guilds);

      if (!error) {
        // setguildData(guilds);
      }

      if (guilds?.length === 0 || !guilds) {
        onOpen2();
      } else {
        let { data: polls, error } = await supabase
          .from("polls")
          .select("*")
          .eq("userId", session.user.id);
        if (!error) {
          console.log(polls);
          setpollData(polls);
          setselectedPollData(polls[0]);
        }
      }
    }
    fetchData();
  }, [session, onOpen2]);

  const addGuildSuccess = async () => {
    let { data: guilds, error } = await supabase
      .from("guilds")
      .select("*")
      .eq("userId", session.user.id);

    if (error) {
      console.log(guilds);
      // setguildData(guilds);
      onClose2();
    }
  };

  const addPollSuccess = async () => {
    let { data: polls, error: pollerror } = await supabase
      .from("polls")
      .select("*")
      .eq("userId", session.user.id);
    console.log(polls);
    console.log(pollerror);
    setpollData(polls);
    onClose();
  };

  return (
    <Box>
      <Container minH={"100vh"} maxW="container.xl" alignItems={"center"}>
        {" "}
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
        <Grid
          templateRows="repeat(2, 1fr)"
          templateColumns="repeat(5, 1fr)"
          gap={4}
        >
          <GridItem rowSpan={2} colSpan={1}>
            <Box w="100%" p={4} mt="2"></Box>
            {pollData.map((ele, index) => {
              return (
                <Box w="100%" p={4}>
                  <PollItem pollData={ele} key={index} />
                </Box>
              );
            })}
          </GridItem>

          <GridItem rowSpan={2} colSpan={4}>
            <Box w="100%" p={4} mt="6"></Box>
            {selectedPollData && <PollResults pollData={selectedPollData} />}
            {/* {pollData.length !== 0 && guildData.length === 1 ? (
              <PollResults pollData={pollData[0]} />
            ) : (
              <Heading size="lg" mt="4">
                Create your first poll
              </Heading>
            )} */}
          </GridItem>
        </Grid>
        <Modal size="6xl" isOpen={isOpen} onClose={onClose} bg="#1a202c">
          <ModalOverlay />
          <ModalContent bg="#1a202c">
            <ModalHeader>Create new Poll</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <CreatePollModal
                session={session}
                addPollSuccess={addPollSuccess}
              />
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
          isOpen={isOpen2}
          onClose={onClose2}
          bg="#1a202c"
        >
          <ModalOverlay />
          <ModalContent bg="#1a202c">
            <ModalHeader>Add guild</ModalHeader>
            {/* <ModalCloseButton /> */}
            <ModalBody>
              <AddGuildModal
                session={session}
                addGuildSuccess={addGuildSuccess}
              />
            </ModalBody>
            {/* <ModalFooter>
                  <Button colorScheme="white" mr={3} onClick={onClose2}>
                    Close
                  </Button>
                </ModalFooter> */}
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
}
