import { useEffect, useState } from "react";
import { saveReferral, getReferrals, getReferrer } from "@/lib/storage";

interface ReferralSystemProps {
  userId: string;
  startParam: string;
}

const ReferralSystem: React.FC<ReferralSystemProps> = ({
  userId,
  startParam,
}) => {
  const [referrals, setReferrals] = useState<string[]>([]);
  const [referrer, setReferrer] = useState<string | null>(null);

  // Вызовем логику рефералок при монтировании/изменении userId и startParam
  useEffect(() => {
    if (!userId) return;

    // Если есть startParam и он не равен нашему userId, значит нас кто-то пригласил
    if (startParam && startParam !== userId) {
      saveReferral(userId, startParam);
    }

    // Получаем, кто нас пригласил
    const whoInvited = getReferrer(userId);
    setReferrer(whoInvited);

    // Получаем, кого мы пригласили
    const myReferrals = getReferrals(userId);
    setReferrals(myReferrals);
  }, [userId, startParam]);

  // Открыть телеграм с параметром старт для друга
  const handleInviteFriend = () => {
    if (!userId) return;
    window.open(
      `https://t.me/share/url?url=https://t.me/bbookkeee_bot?start=${userId}&text=РеферальнаяСистема`,
      "_blank"
    );
  };

  // Скопировать реферальную ссылку
  const handleCopyInviteLink = async () => {
    if (!userId) return;
    const link = `https://t.me/bbookkeee_bot?start=${userId}`;
    try {
      await navigator.clipboard.writeText(link);
      alert("Invite link copied!");
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  return (
    <>
      {/* Если пользователь был приглашён кем-то */}
      {referrer && (
        <div className="text-green-600 mb-4">
          You were referred by user {referrer}
        </div>
      )}

      {/* Кнопки приглашения */}
      <div className="mb-4">
        <button
          onClick={handleInviteFriend}
          className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
        >
          Invite Friend
        </button>
        <button
          onClick={handleCopyInviteLink}
          className="bg-green-500 text-white py-2 px-4 rounded"
        >
          Copy Invite Link
        </button>
      </div>

      {/* Если у пользователя есть рефералы, показываем их */}
      {referrals.length > 0 && (
        <div>
          <h3 className="text-lg font-bold mb-2">Your referrals</h3>
          {referrals.map((r) => (
            <div key={r}>User {r}</div>
          ))}
        </div>
      )}
    </>
  );
};

export default ReferralSystem;
