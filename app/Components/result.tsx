'use client'

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { CopyIcon, CheckIcon } from "@radix-ui/react-icons"

interface ResultProps {
  convertedAddresses: string[]
  onClose: () => void
}

export function Result({ convertedAddresses, onClose }: ResultProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(convertedAddresses.join("\n"))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <Card className="w-full max-w-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 flex justify-between items-center">
          <CardTitle className="text-white">Converted Addresses</CardTitle>
         
        </CardHeader>
        <CardContent className="p-6">
          <Textarea
            value={convertedAddresses.join("\n")}
            readOnly
            className="h-40 mb-4"
          />
          <div className="flex justify-end gap-2">
          <Button  size="icon" className="w-1/2" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleCopy} className="w-1/2">
            {copied ? (
              <>
                <CheckIcon className="mr-2 h-4 w-4" /> Copied!
              </>
            ) : (
              <>
                <CopyIcon className="mr-2 h-4 w-4" /> Copy to Clipboard
              </>
            )}
          </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}