import { Box } from "@chakra-ui/react";
import React from "react";
export default function PollResults({ pollData }) {
  return (
    <Box
      width="xs"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      cursor="pointer"
    >
      <Box p="4">
        <Box
          mt="1"
          fontWeight="semibold"
          as="h4"
          lineHeight="tight"
          isTruncated
        >
          {pollData.description}
        </Box>

        <Box display="flex" mt="2" alignItems="center">
          <Box as="span" color="gray.200" fontSize="sm">
            {JSON.parse(pollData.options).length} Options
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
