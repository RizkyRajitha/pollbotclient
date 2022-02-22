import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
  FormErrorMessage,
  InputGroup,
  HStack,
  InputRightElement,
  Container,
  VStack,
  Grid,
  GridItem,
  FormHelperText,
  Textarea,
  UnorderedList,
  ListItem,
  Spacer,
  OrderedList,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Switch,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import React from "react";
import { useForm } from "react-hook-form";

const endpoint = process.env.REACT_APP_ENDPOINT;

export default function AddGuildModal({ session, addGuildSuccess }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {},
  });

  const [isOpen, setIsOpen] = React.useState(false);
  const [errorMsg, seterrorMsg] = React.useState("");
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef();

  const onSubmit = async (data) => {
    console.log(data);

    console.log(session);
    console.log(session.access_token);

    try {
      let res = await fetch(`${endpoint}/v1/addguild`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { authorization: session.access_token },
      }).then((res) => res.json());
      console.log(res.ok);

      if (res.statusCode === 500 || res.statusCode === 400) {
        console.log(res.message);
        seterrorMsg(res.message);
        setIsOpen(true);
      } else {
        console.log(res);
        addGuildSuccess();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Container
      // bg="#1a202c"
      maxW="container.md"
      alignItems={"center"}
      mb="4"
      mt="4"
    >
      <Flex alignContent="start" alignItems="start" direction="column">
        <Heading mb="4" s="h4" size="md" textAlign="center">
          Step 1 : Invite Poll bot to your discord server{" "}
          <Link
            color="blue.200"
            href="https://discord.com/api/oauth2/authorize?client_id=944542855525982268&permissions=206912&scope=bot"
          >
            qqqq
          </Link>
          <Spacer />
        </Heading>
        <Heading mb="4" s="h4" size="md" textAlign="center">
          Step 2 : Fill following info
        </Heading>
      </Flex>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl id="email" isInvalid={errors.guildid}>
          <FormLabel>Email </FormLabel>
          <Input
            type="text"
            id="guildid"
            placeholder="Guild (Server) id"
            {...register("guildid", {
              required: "Guild (Server) id is required",
            })}
          />{" "}
          <FormErrorMessage>
            {errors.guildid && errors.guildid.message}
          </FormErrorMessage>
        </FormControl>{" "}
        <FormControl id="email" isInvalid={errors.channelid}>
          <FormLabel>Email </FormLabel>
          <Input
            type="text"
            id="channelid"
            placeholder="Channel id"
            {...register("channelid", {
              required: "Channel id is required",
            })}
          />{" "}
          <FormErrorMessage>
            {errors.channelid && errors.channelid.message}
          </FormErrorMessage>
        </FormControl>
        <Flex alignContent="end" alignItems="end" align="end" mt="10">
          <Button
            colorScheme="teal"
            ml="2"
            type="submit"
            isLoading={isSubmitting}
          >
            Add Server
          </Button>
          <Spacer />
        </Flex>
      </form>{" "}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Error
            </AlertDialogHeader>

            <AlertDialogBody>{errorMsg}</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Close
              </Button>
              {/* <Button colorScheme="red" onClick={onClose} ml={3}>
                Delete
              </Button> */}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
}
