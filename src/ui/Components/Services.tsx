import { useTranslations } from "next-intl";

const Services = () => {
	const services = useTranslations();
	const servicesArray = services.raw("services");

	console.log("services", services);

	return <></>;
};
export default Services;
