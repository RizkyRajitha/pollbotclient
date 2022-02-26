import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
  FormErrorMessage,
  Container,
  Textarea,
  Spacer,
  Switch,
  useToast,
} from "@chakra-ui/react";
import { useFieldArray, useForm } from "react-hook-form";
import { supabase } from "../supabaseClient";
import { postApi } from "../util/fetch";

export default function CreatePollModal({ session, addPollSuccess }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      option: [
        { option: "One", optiondescription: "Option one description" },
        { option: "Two", optiondescription: "Option two description" },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "option",
  });

  const toast = useToast();

  const onSubmit = async (data) => {
    let { data: guildsData, error } = await supabase.from("guilds").select("*");

    if (error) {
      console.log(error);
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    let payload = {
      ...data,
      userId: session.user.id,
      channelId: guildsData[0].channelId,
    };

    // console.log(payload);
    try {
      await postApi("/v1/createpoll", payload, session.access_token);
      addPollSuccess();
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
    // console.log(res);
  };
  return (
    <Container maxW="container.xl" alignItems={"center"} mb="4" mt="4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box mr="2" ml="2">
          <FormControl isInvalid={errors.description}>
            <Textarea
              placeholder="Poll description"
              {...register("description", {
                required: "Poll description is required",
              })}
            />{" "}
            <FormErrorMessage>
              {errors.description && errors.description.message}
            </FormErrorMessage>
          </FormControl>
        </Box>
        <Box mt="6" ml="2">
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="email-alerts" mb="0">
              Enable multiple choices
            </FormLabel>
            <Switch id="email-alerts" {...register("multichoice")} />
          </FormControl>
        </Box>
        <Heading mb="4" s="h4" size="md" textAlign="center">
          Options
        </Heading>
        <Box>
          {fields.map((item, index) => (
            <Box key={item.id}>
              <Flex>
                <Box flex="1" p="2">
                  <FormControl
                    id="email"
                    isInvalid={errors.option?.[index]?.option}
                  >
                    <Input
                      type="text"
                      id="option"
                      placeholder="option"
                      _placeholder={{ color: "white" }}
                      {...register(`option.${index}.option`, {
                        required: "Option is required",
                      })}
                    />{" "}
                    <FormErrorMessage>
                      {errors.option?.[index]?.option &&
                        errors.option?.[index]?.option.message}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl id="optiondescription" mt="4">
                    <Input
                      type="text"
                      id="optiondescription"
                      placeholder="Option description"
                      _placeholder={{ color: "white" }}
                      {...register(`option.${index}.optiondescription`)}
                    />{" "}
                  </FormControl>
                </Box>
                <Flex p="2" alignItems="end">
                  <Button
                    colorScheme="red"
                    //   mr="4"
                    type="button"
                    onClick={() => remove(index)}
                  >
                    Delete
                  </Button>
                </Flex>
              </Flex>
            </Box>
          ))}
        </Box>
        <Flex alignContent="end" alignItems="end" align="end" mt="10">
          <Button
            colorScheme="teal"
            ml="2"
            type="submit"
            isLoading={isSubmitting}
          >
            Cast vote
          </Button>
          <Spacer />
          <Button
            colorScheme="teal"
            type="button"
            mr="2"
            isDisabled={fields.length > 5}
            onClick={() => {
              console.log(fields.length);
              append({
                option: "Another option",
                optiondescription: "Option description",
              });
            }}
          >
            Add option
          </Button>
        </Flex>
      </form>
    </Container>
  );
}
