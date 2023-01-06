import { GetStaticProps } from 'next';

import { HeadProps } from 'seo/Head/Head';
import { sharedValues } from 'utils/sharedValues';

export interface PageProps {
	head: HeadProps;
}

export const getStaticProps: GetStaticProps = () => {
	const head: HeadProps = {
		title: 'Three Starter',
		description: 'Michal Zalobny portfolio 2023 - WebGL | GLSL | Canvas',
	};

	return {
		props: {
			head,
		},
		revalidate: sharedValues.ISR_TIMEOUT,
	};
};
