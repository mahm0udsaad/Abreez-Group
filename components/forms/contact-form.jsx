"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { sendEmail } from "@/actions/contact";

const ContactForm = ({ t }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      toast({
        title: t("contact.error"),
        description: t("contact.error_message"),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await sendEmail(formData);
      toast({
        title: t("contact.success"),
        description: t("contact.success_message"),
        variant: "default",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast({
        title: t("contact.error"),
        description: error.message || t("contact.error_message"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-[#8cc63f] text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl leading-[4rem] font-bold mb-8 text-center">
            {t("contact.title")}
          </h2>
          <p className="text-xl mb-8 text-center">{t("contact.subtitle")}</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t("contact.form.name")}
                className="bg-white bg-opacity-20 border-white placeholder-white text-white"
              />
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t("contact.form.email")}
                className="bg-white bg-opacity-20 border-white placeholder-white text-white"
              />
            </div>
            <Input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder={t("contact.form.subject")}
              className="bg-white bg-opacity-20 border-white placeholder-white text-white"
            />
            <Textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={t("contact.form.message")}
              className="bg-white bg-opacity-20 border-white placeholder-white text-white"
              rows={4}
            />
            <div className="text-center">
              <Button
                type="submit"
                className="bg-white text-[#114270] hover:bg-gray-100"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? t("contact.form.sending")
                  : t("contact.form.submit")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
