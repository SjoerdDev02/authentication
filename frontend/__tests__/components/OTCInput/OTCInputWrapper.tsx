import { useState } from "react";

import { OTC_LENGTH } from "@/components/authentication/otc/OTCForm";
import { OTCInput } from "@/components/authentication/otc/OTCInput";

type OTCInputWrapperProps = {
    initialOtc?: string[];
}

const OTCInputWrapper = (props: OTCInputWrapperProps) => {
	const [otc, setOtc] = useState(props.initialOtc ?? Array.from({ length: OTC_LENGTH }, () => ''));

	return (
		<OTCInput
			onChange={setOtc}
			otc={otc}
		/>
	);
};

export default OTCInputWrapper;