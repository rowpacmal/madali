import { useContext, useEffect, useState } from 'react';
import style from './style.module.css';
import { AppContext } from '../../../../contexts/AppContext';
import useEducationCertificate from '../../../../hooks/useEducationCertificate';
import useGradingSystem from '../../../../hooks/useGradingSystem';
import useStudentManagement from '../../../../hooks/useStudentManagement';
import BadgeModal from '../BadgeModal';

// This is the student's badge tab, where they can view their badges/certificates NFTs.
function BadgeTab() {
  const { account } = useContext(AppContext);
  const { certificateContract, getCertificate, getTotalCertificates } =
    useEducationCertificate();
  const { gradingContract, getGrade } = useGradingSystem();
  const { getStudent } = useStudentManagement();
  const [badges, setBadges] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});

  useEffect(
    () => {
      if (!certificateContract || !gradingContract) return;

      handleOnRefresh();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [certificateContract, gradingContract]
  );

  // This is used to refresh the badges when the user clicks the refresh button, or the page is reloaded.
  async function handleOnRefresh() {
    const tempBadges = [];
    const studentData = await getStudent(account);
    const totalCert = await getTotalCertificates();

    for (let i = 0; i < totalCert; i++) {
      const certificate = await getCertificate(i);

      if (certificate.owner === studentData.student) {
        const grade = await getGrade(certificate.grade);

        if (grade) {
          tempBadges.push({
            ...grade,
            owner: certificate.owner,
            certificate: certificate.id,
            imageURL: certificate.imageURL,
          });
        }
      }
    }

    setBadges(tempBadges);
  }

  // This is the function that is called when the user clicks the a badge.
  function handleOnView(data) {
    setModalData(data);
    setShowModal(true);
  }

  return (
    <>
      <section>
        <header className={style.header}>
          <h2>Badge Collection</h2>
        </header>

        <div className={style.refresh}>
          <button type="button" onClick={handleOnRefresh}>
            Refresh
          </button>
        </div>

        <div className={style.badges}>
          {badges.map((badge) => (
            <div
              key={badge.certificate}
              className={style.badge}
              onClick={() => handleOnView(badge)}
            >
              <img
                src={`/${badge.imageURL}`}
                alt="Badge"
                className={style.img}
              />
            </div>
          ))}
        </div>
      </section>

      {showModal && <BadgeModal data={modalData} setShowModal={setShowModal} />}
    </>
  );
}

export default BadgeTab;
