import React from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  ColorModeProvider
} from "@chakra-ui/core";
import { TextField } from '@rmwc/textfield';
import '@rmwc/textfield/styles';

export function ProbeAdd() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        variant="ghost"
        variantColor="teal"
        leftIcon="add"
        onClick={onOpen}
      >
        Add a probe
      </Button>
      <ColorModeProvider value="light">
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <TextField outlined label="Probe Name" />
          </ModalBody>

          <ModalFooter>
            <Button variantColor="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      </ColorModeProvider>
    </>
  );
}