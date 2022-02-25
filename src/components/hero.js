import {
  Flex,
  Container,
  Heading,
  Stack,
  Text,
  Button,
  Link,
  Box,
  SimpleGrid,
  Icon,
  chakra,
  useColorModeValue,
  VisuallyHidden,
} from "@chakra-ui/react";
import { FaChartPie, FaDiscord, FaCheckDouble, FaGithub } from "react-icons/fa";
export default function Hero(props) {
  console.log(props);
  return (
    <>
      <Container minH="93vh" maxW={"5xl"}>
        <Stack
          textAlign={"center"}
          align={"center"}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 20, md: 28 }}
        >
          <Heading
            fontWeight={600}
            fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}
            lineHeight={"110%"}
          >
            Disco-Poll
          </Heading>
          <Heading
            fontWeight={600}
            fontSize={{ base: "2xl", sm: "2xl", md: "2xl" }}
            lineHeight={"110%"}
            color={"purple.400"}
          >
            Discord poll on steroids
          </Heading>

          <Text color={"gray.500"} maxW={"2xl"}>
            Create discord polls with a dashboard and view comprehensive data
            about the polls realtime and graphical visualization
          </Text>
          <Stack spacing={6} direction={"row"}>
            <Link href="/app">
              <Button
                rounded={"full"}
                px={6}
                colorScheme={"purple"}
                bg={"purple.400"}
              >
                Check out
              </Button>
            </Link>
          </Stack>
          <Flex w={"full"}></Flex>
        </Stack>
        <SimpleThreeColumns />
      </Container>
      <SmallWithSocial />
    </>
  );
}

const Feature = ({ title, text, icon }) => {
  return (
    <Stack>
      <Flex
        w={16}
        h={16}
        align={"center"}
        justify={"center"}
        color={"white"}
        rounded={"full"}
        bg={"gray.100"}
        mb={1}
      >
        {icon}
      </Flex>
      <Text fontWeight={600}>{title}</Text>
      <Text color={"gray.400"} textAlign="justify">
        {text}
      </Text>
    </Stack>
  );
};

function SimpleThreeColumns() {
  return (
    <Box p={4}>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
        <Feature
          icon={<Icon as={FaDiscord} w={10} h={10} color="#5865F2" />}
          title={"Discord Bot"}
          text={
            "Login to disco-poll , invite Disco Poll bot to your server , and start creating polls using the dashboard. "
          }
        />
        <Feature
          icon={<Icon as={FaChartPie} w={10} h={10} color="teal" />}
          title={"graphical visualization"}
          text={
            "Get detailed version of votes with user vise vote breakdown and graphical visualization with pie diagram."
          }
        />
        <Feature
          icon={<Icon as={FaCheckDouble} w={10} h={10} color="orange" />}
          title={"Single/Multi options"}
          text={
            "Restrict the poll to be single selection or multi selection .End and start the poll anytime you want."
          }
        />
      </SimpleGrid>
    </Box>
  );
}

const SocialButton = ({ children, label, href }) => {
  return (
    <chakra.button
      bg={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
      rounded={"full"}
      w={8}
      h={8}
      cursor={"pointer"}
      as={"a"}
      href={href}
      display={"inline-flex"}
      alignItems={"center"}
      justifyContent={"center"}
      transition={"background 0.3s ease"}
      _hover={{
        bg: useColorModeValue("blackAlpha.200", "whiteAlpha.200"),
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

function SmallWithSocial() {
  return (
    <Box height="7vh">
      <Container
        as={Stack}
        maxW={"6xl"}
        py={4}
        direction={{ base: "column", md: "row" }}
        spacing={4}
        justify={{ base: "center", md: "space-between" }}
        align={{ base: "center", md: "center" }}
      >
        <Text>
          Developed for{" "}
          <Link
            color="purple.200"
            href="https://townhall.hashnode.com/netlify-hackathon"
          >
            netlify-hackathon
          </Link>{" "}
          using{" "}
          <Link color="purple.200" href="https://reactjs.org/">
            React
          </Link>{" "}
          <Link color="purple.200" href="https://supabase.io/">
            Supabase
          </Link>{" "}
          <Link color="purple.200" href="https://www.fastify.io/">
            Fastify
          </Link>{" "}
          <Link color="purple.200" href="https://discord.js.org/">
            Discord.js
          </Link>{" "}
          Hosted on{" "}
          <Link color="purple.200" href="https://www.netlify.com/">
            Netlify
          </Link>{" "}
        </Text>
        <Stack direction={"row"} spacing={6}>
          <SocialButton
            label={"Github"}
            href="https://github.com/RizkyRajitha/pollbotclient"
          >
            <FaGithub />
          </SocialButton>
        </Stack>
      </Container>
    </Box>
  );
}
