import { useTranslation } from 'react-i18next';

function PageNotFound() {

    const { t } = useTranslation();

    return (
        <>
            <span className="404">404</span>
            <span className="page_not_found">{t('common.page-not-found')}</span>
        </>
    )
};

export default PageNotFound;