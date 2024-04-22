import React from "react";
import { Textarea } from "@mantine/core";
import { RiUploadCloudLine, RiMic2Line } from "react-icons/ri"; // Import microphone icon
import {
  Box,
  Button,
  Loader,
  Notification,
  Stack,
  Group,
  SegmentedControl,
  Image,
  Text,
  ActionIcon,
} from "@mantine/core";
import { Action } from "@dnd-kit/core/dist/store";
interface QuestionTextAreaProps {
  form: any;
  handleEnterKey: (event: KeyboardEvent) => void;
  label?: string;
  placeholder?: string;
  disableInput?: boolean;
  required?: boolean;
}
// mimic the work done at image function, and start by uploading the local file
// one sec
// Inside your component

export function QuestionTextArea({
  form,
  handleEnterKey,
  label = "",
  placeholder = "Ask a question",
  disableInput = false,
  required = false,
}: QuestionTextAreaProps): JSX.Element {
  const inputFileRef = React.useRef<HTMLInputElement | null>(null);

  return (

<div style={{ display: "flex", alignItems: "center" }}>
  <Box sx={{ position: 'relative', width: '100%' }}>
    <Textarea
      label={label}
      placeholder={placeholder}
      minRows={2}
      onKeyDown={(event) => {
        if (disableInput) {
          return;
        }
        if (event.key !== "Enter") {
          event.stopPropagation();
        } else if (event.shiftKey) {
          // Shift + Enter, move to a new line
          event.stopPropagation();
        } else {
          handleEnterKey(event as unknown as KeyboardEvent);
        }
      }}
      required={required}
      {...form.getInputProps("question")}
    />
    <input
      type="file"
      ref={inputFileRef}
      style={{ display: "none" }}
      onChange={(event) => {

        const file = event.target.files?.[0]; // Null check added here
        
        if (file) {
          
          //uploadAudio(file);
        }
      }}
    />

    <ActionIcon
      variant="transparent"
      size="sm"
      style={{ position: 'absolute', right: '40px', top: '50%', transform: 'translateY(-50%)' }} // Adjust spacing as needed
      onClick={() => {
        inputFileRef.current?.click(); // Null check added here

        //alert("Upload audio clicked");
        // Handle click on the microphone button
        // This is where you can trigger audio upload functionality
        //console.log("Upload audio");
      }}
    >
      <RiMic2Line />
    </ActionIcon>
    <ActionIcon
      variant="transparent"
      size="sm"
      style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }} // Adjust spacing as needed
      onClick={() => {
        alert("Upload file clicked");

        // Handle click on the file upload button
        // This is where you can trigger file upload functionality
        console.log("Upload file");
      }}
    >
      <RiUploadCloudLine />
    </ActionIcon>
  </Box>
</div>

    // <Textarea
    //   label={label}
    //   placeholder={placeholder}
    //   minRows={2}
    //   onKeyDown={(event) => {
    //     if (disableInput) {
    //       return;
    //     }
    //     if (event.key !== "Enter") {
    //       event.stopPropagation();
    //     } else if (event.shiftKey) {
    //       // Shift + Enter, move to a new line
    //       event.stopPropagation();
    //     } else {
    //       handleEnterKey(event as unknown as KeyboardEvent);
    //     }
    //   }}
    //   required={required}
    //   {...form.getInputProps("question")}
    // />
  );
}
