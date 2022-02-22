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
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { supabase } from "../supabaseClient";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleLogin = async (data) => {
    console.log(data);
    try {
      const { error } = await supabase.auth.signIn({
        email: data.email,
        // password: data.password,
      });
      if (error) throw error;
      // alert("Check your email for the login link!");
    } catch (error) {
      console.log(error);
      // alert(error.error_description || error.message);
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
          {/* <Text fontSize={"lg"} color={"gray.600"}>
            to enjoy all of our cool <Link color={"blue.400"}>features</Link> ✌️
          </Text> */}
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <form onSubmit={handleSubmit(handleLogin)}>
              <FormControl id="email" isInvalid={errors.email}>
                <FormLabel>Email </FormLabel>
                <Input
                  type="email"
                  id="email"
                  placeholder="Email"
                  {...register("email", {
                    required: "Email is required",
                  })}
                />{" "}
                <FormErrorMessage>
                  {errors.email && errors.email.message}
                </FormErrorMessage>
              </FormControl>
              {/* <FormControl
                id="password"
                isInvalid={errors.password}
                marginTop="4"
              >
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  id="password"
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />{" "}
                <FormErrorMessage>
                  {errors.password && errors.password.message}
                </FormErrorMessage>
              </FormControl> */}

              <Stack spacing={5}>
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  align={"start"}
                  justify={"space-between"}
                >
                  {/* <Checkbox>Remember me</Checkbox>
                  <Link color={"blue.400"}>Forgot password?</Link> */}
                </Stack>
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
      </Stack>
    </Flex>
  );
}

// import { useState } from "react";
// import { supabase } from "../supabaseClient";

// export default function Login() {
//   const [loading, setLoading] = useState(false);
//   const [email, setEmail] = useState("");

//   const handleLogin = async (email) => {
//     try {
//       setLoading(true);
//       const { error } = await supabase.auth.signIn({ email });
//       if (error) throw error;
//       alert("Check your email for the login link!");
//     } catch (error) {
//       alert(error.error_description || error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="row flex flex-center">
//       <div className="col-6 form-widget">
//         <h1 className="header">Supabase + React</h1>
//         <p className="description">
//           Sign in via magic link with your email below
//         </p>
//         <div>
//           <input
//             className="inputField"
//             type="email"
//             placeholder="Your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </div>
//         <div>
//           <button
//             onClick={(e) => {
//               e.preventDefault();
//               handleLogin(email);
//             }}
//             className={"button block"}
//             disabled={loading}
//           >
//             {loading ? <span>Loading</span> : <span>Send magic link</span>}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
