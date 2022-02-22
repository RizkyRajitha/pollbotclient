import { Box, Badge } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
export default function PollResults({ pollData }) {
  console.log(JSON.parse(pollData.options));

  const property = {
    imageUrl: "https://bit.ly/2Z4KKcF",
    imageAlt: "Rear view of modern home with pool",
    beds: 3,
    baths: 2,
    title: "Modern home in city center in the heart of historic Los Angeles",
    formattedPrice: "$1,900.00",
    reviewCount: 34,
    rating: 4,
  };
  return (
    <Box width="xs" borderWidth="1px" borderRadius="lg" overflow="hidden">
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

        {pollData.options &&
          JSON.parse(pollData.options).map((ele, index) => {
            return (
              <Box>
                <Box as="span" fontSize="sm">
                  {ele.label}
                </Box>
              </Box>
            );
          })}

        <Box display="flex" mt="2" alignItems="center">
          {/* {Array(5)
            .fill("")
            .map((_, i) => (
              <StarIcon
                key={i}
                color={i < property.rating ? "teal.500" : "gray.300"}
              />
            ))} */}
          <Box as="span" ml="2" color="gray.200" fontSize="sm">
            {property.reviewCount} reviews
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
