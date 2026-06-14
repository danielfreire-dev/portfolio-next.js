import { useTranslations } from "next-intl";

/**
 * Services section (stub).
 *
 * Intended to render a list of services from translations. Currently returns
 * an empty fragment.
 */
const Services = () => {
  const services = useTranslations();
  const servicesArray = services.raw("services");

  console.log("services", services);

  return <></>;
};
export default Services;
