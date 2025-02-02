'use client';

import { IconBrandZapier } from "@tabler/icons-react";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";

import { registerUser } from "@/app/actions/authentication";
import styles from '@/components/authentication/register/RegisterForm.module.scss';
import Button from "@/components/common/buttons/Button";
import { Flex } from "@/components/common/Flex";
import TextInput from "@/components/common/input/text/TextInput";
import { initialAuthFormState } from "@/constants/auth";
import { pages } from "@/constants/routes";
import { useTranslationsContext } from "@/stores/translationsStore";
import userStore from "@/stores/userStore";

import AuthFormFooter from "../wrappers/AuthFormFooter";
import AuthFormHeader from "../wrappers/AuthFormHeader";
import AuthFormWrapper from "../wrappers/AuthFormWrapper";

const Register = () => {
	const getTranslation = useTranslationsContext();
	const router = useRouter();

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [passwordConfirmation, setPasswordConfirmation] = useState('');

	const handleRegsterUser = async (prevState: any, formData: FormData) => {
		const result = await registerUser(prevState, formData);

		if (result.success) {
			router.push(pages.Login.path);

			if (result.data) {
				userStore.id = result.data.id;
				userStore.name = result.data.name;
				userStore.email = result.data.email;
			}
		}

		return result;
	};

	const [state, formAction, isPending] = useActionState(
		handleRegsterUser,
		initialAuthFormState
	);

	const FormHeader = (
		<AuthFormHeader
			icon={IconBrandZapier}
			label={getTranslation('Authentication.signUp')}
		/>
	);

	const FormFooter = (
		<AuthFormFooter
			label={getTranslation('Authentication.alreadyHaveAnAccount')}
			linkHref={pages.Login.path}
			linkText={getTranslation('Authentication.signIn')}
		/>
	);

	return (
		<Flex
			className={styles['register-form']}
			flexDirection="column"
			gap={5}
		>
			<AuthFormWrapper
				action={formAction}
				footer={FormFooter}
				header={FormHeader}
			>
				<div className={styles['register-form__input-wrapper']}>
					<TextInput
						name="email"
						onChange={(e) => setEmail(e)}
						placeholder={getTranslation('Authentication.emailPlaceholder')}
						type="email"
						value={email}
				 	/>

					<TextInput
						name="name"
						onChange={(e) => setName(e)}
						placeholder={getTranslation('Authentication.namePlaceholder')}
						type="text"
						value={name}
				 		/>

					<TextInput
						name="password"
						onChange={(e) => setPassword(e)}
						placeholder={getTranslation('Authentication.passwordPlaceholder')}
						type="password"
						value={password}
				 	/>

					<TextInput
						name="passwordConfirmation"
						onChange={(e) => setPasswordConfirmation(e)}
						placeholder={getTranslation('Authentication.passwordConfirmPlaceholder')}
						type="password"
						value={passwordConfirmation}
				 	/>
				</div>

				{state.message && (
					<div className={classNames('label', `label--${state.success ? 'medium-success' : 'medium-error'}`)}>
						{state.message}
					</div>
				)}

				<Button
					color="primary"
					loading={isPending}
					type="submit"
				>
					<span>
						{getTranslation('Authentication.registerLabel')}
					</span>
				</Button>
			</AuthFormWrapper>
		</Flex>
	);
};

export default Register;