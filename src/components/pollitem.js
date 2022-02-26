import { Badge, Box, useMediaQuery } from "@chakra-ui/react";
import React from "react";
import { formatDistance } from "date-fns";
export default function PollResults({ pollData }) {
  const [isLargerThan1280] = useMediaQuery("(min-width: 1280px)");

  return (
    <Box
      Box
      maxW={isLargerThan1280 ? "sm" : "full"}
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
        <Box>
          <Badge colorScheme="teal" isTruncated variant="outline" pt="0.5">
            {formatDistance(new Date(pollData.created_at), new Date(), {
              addSuffix: true,
            })}
          </Badge>
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
