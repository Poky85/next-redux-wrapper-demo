import { NextPage } from 'next'
import { WithTranslation } from 'next-i18next';
import { withTranslation } from '../../i18n';

type InitialProps = {
  namespacesRequired: string[]
}

type Props = WithTranslation

const I18nPage: NextPage<Props, InitialProps> = ({ t }) => (
  <div>
    <h1>This is translation loaded using next-i18next:</h1>
    <p>{t('translation-here')}</p>
  </div>

)

I18nPage.getInitialProps = () => ({
  namespacesRequired: ['common'],
})

export default withTranslation('common')(I18nPage)
