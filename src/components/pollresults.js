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
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
export default function PollResults({ pollData }) {
  const [pollResults, setPollResults] = useState([]);
  const [pollResultsByOptions, setPollResultsByOptions] = useState([]);

  useEffect(() => {
    console.log("pollddd - -- - ", pollData.id);

    supabase
      .from("results")
      .on("*", async (payload) => {
        console.log("Change received!", payload);
        console.log(pollData.id);
        await updateResults();
      })
      .subscribe();
    updateResults();
    console.log("Change subscribe!");

    // return results.unsubscribe();
  }, [pollData]);

  const updateResults = async () => {
    let { data, error } = await supabase
      .from("results")
      .select("discordUsername,selections")
      .eq("pollId", pollData?.id);
    console.log(data);

    let obj = {};

    // let tmpdata = { ...data };
    // tmpdata = tmpdata.map(ele=>ele.)
    let options = JSON.parse(pollData.options).map((ele) => ele.value);
    console.log(options);
    for (let index = 0; index < options.length; index++) {
      const element = options[index];

      obj[element] = 0;
    }
    console.log(obj);

    data.forEach((ele) => {
      for (let index = 0; index < options.length; index++) {
        const element = options[index];
        console.log(element);
        if (ele.selections[0] === element) {
          obj[element] = obj[element] + 1;
        }
      }
    });
    console.log(obj);

    // for (let index = 0; index < Object.keys.length; index++) {
    //   const element = options[index];

    //   obj[element] = 0;
    // }

    console.log(error);
    setPollResults(data);
    setPollResultsByOptions(obj);
  };

  return (
    <Box maxW="4xl" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Box p="4">
        {/* <Box
          mt="1"
          fontWeight="semibold"
          as="h3"
          lineHeight="normal"
          isTruncated
        >
          {pollData?.description}
        </Box> */}
        <Heading mb="4" mt="4">
          {`${pollData?.description}  ?`}
        </Heading>
        <Box
          display="flex"
          mt="2"
          borderWidth="1px"
          borderRadius="lg"
          alignItems="center"
        >
          <Table variant="simple">
            {/* <TableCaption>Poll results</TableCaption> */}
            <Thead>
              <Tr>
                <Th>User</Th>
                <Th isNumeric>Vote</Th>
              </Tr>
            </Thead>
            <Tbody>
              {pollResultsByOptions &&
                Object.keys(pollResultsByOptions).map((ele, index) => {
                  return (
                    <Tr>
                      <Td>{String(ele).split("_")[0]}</Td>
                      <Td isNumeric>{pollResultsByOptions[ele]}</Td>
                    </Tr>
                  );
                })}

              <Tr>
                <Td color="teal">Total</Td>
                <Td isNumeric>{PollResults.length}</Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
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
              {pollResults &&
                pollResults.map((ele, index) => {
                  return (
                    <Tr key={index}>
                      <Td>{ele.discordUsername}</Td>
                      <Td>{String(ele.selections[0]).split("_")[0]}</Td>
                    </Tr>
                  );
                })}
            </Tbody>
          </Table>
        </Box>
        <Flex justifyContent="end">
          <Button mt={3} colorScheme="blue">
            View vote breakdown
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}
