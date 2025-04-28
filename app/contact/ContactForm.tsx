"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "../components/ui/textarea";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      // In a real app, you would send the form data to your backend
      console.log("Form submitted:", formData);
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 1500);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {isSubmitted ? (
        <div className="bg-green-50 p-4 rounded-md text-green-700 border border-green-200">
          <h3 className="font-medium text-lg mb-2">Повідомлення надіслано!</h3>
          <p>
            Дякуємо за ваше звернення. Ми зв&apos;яжемося з вами найближчим
            часом.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => setIsSubmitted(false)}
          >
            Надіслати ще одне повідомлення
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Ім&apos;я
              </label>
              <Input
                id="name"
                placeholder="Введіть ваше ім'я"
                className="transition-all duration-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Введіть ваш email"
                className="transition-all duration-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium mb-1">
              Тема
            </label>
            <Input
              id="subject"
              placeholder="Введіть тему повідомлення"
              className="transition-all duration-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1">
              Повідомлення
            </label>
            <Textarea
              id="message"
              placeholder="Введіть ваше повідомлення"
              rows={5}
              className="transition-all duration-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full md:w-auto gap-2 transition-all duration-300 hover:shadow-md transform hover:scale-105"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Надсилання..." : "Надіслати"}{" "}
            <Send className="h-4 w-4" />
          </Button>
        </>
      )}
    </form>
  );
}
