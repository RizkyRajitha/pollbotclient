import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  useColorModeValue,
  FormErrorMessage,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import React from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../supabaseClient";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const [isEmailSent, setisEmailSent] = React.useState(false);

  //error dialog
  const [isErrorOpen, setIsErrorOpen] = React.useState(false);
  const [errorMsg, seterrorMsg] = React.useState("");
  const onErrorClose = () => setIsErrorOpen(false);
  const cancelRef = React.useRef();

  const handleLogin = async (data) => {
    try {
      const { error } = await supabase.auth.signIn({
        email: data.email,
      });
      if (error) {
        throw error;
      }
      setisEmailSent(true);
    } catch (error) {
      console.log(error);
      seterrorMsg(error.message);
    }
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"5xl"}>Login</Heading>
          {isEmailSent && (
            <Alert
              status="success"
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              height="200px"
            >
              <AlertIcon boxSize="40px" mr={0} />
              <AlertTitle mt={4} mb={1} fontSize="lg">
                Email sent!
              </AlertTitle>
              <AlertDescription maxWidth="sm">
                Check your mail to get magic link
              </AlertDescription>
            </Alert>
          )}
        </Stack>
        {!isEmailSent && (
          <Box rounded={"lg"} bg="#374052" boxShadow={"lg"} p={8}>
            <Stack spacing={4}>
              <form onSubmit={handleSubmit(handleLogin)}>
                <FormControl id="email" isInvalid={errors.email}>
                  <FormLabel>Email </FormLabel>
                  <Input
                    type="email"
                    id="email"
                    {...register("email", {
                      required: "Email is required",
                    })}
                  />
                  <FormErrorMessage>
                    {errors.email && errors.email.message}
                  </FormErrorMessage>
                </FormControl>

                <Stack spacing={5}>
                  <Stack
                    direction={{ base: "column", sm: "row" }}
                    align={"start"}
                    justify={"space-between"}
                  ></Stack>
                  <Button
                    bg={"blue.400"}
                    color={"white"}
                    type="submit"
                    isLoading={isSubmitting}
                    _hover={{
                      bg: "blue.500",
                    }}
                  >
                    Login
                  </Button>
                </Stack>
              </form>
            </Stack>
          </Box>
        )}
      </Stack>
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
    </Flex>
  );
}
