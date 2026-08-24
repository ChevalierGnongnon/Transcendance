import { useTranslation } from "react-i18next";
import defaultAvatar from "../../../public/default-avatar.png"
import AddFriend from "./add-friend";
import "../../scss/friends.scss"
function MyFriends() {
    const { t } = useTranslation();
    return (
        <div className="friends-page m-2 p-2">
            <h1>{t("friends.my-friends")}</h1>
            <div className="row g-4 justify-content-center shortcut-grid">
                <div className="col-12 col-md-6 col-xl-4">
                    <figure className="friend-card py-2 px-1 justify-content-center">
                        <img src={defaultAvatar} alt={t("friends.avatar-alt")} />
                        <span>Nokha</span>
                        <input type="button" value={t("friends.delete-friend")} className="delete-button px-2" />
                    </figure>
                </div>
                <div className="col-12 col-md-6 col-xl-4">
                    <figure className="friend-card py-2 px-1 justify-content-center">
                        <img src={defaultAvatar} alt={t("friends.avatar-alt")} />
                        <span>Chems</span>
                        <input type="button" value={t("friends.delete-friend")} className="delete-button px-2" />
                    </figure>
                </div>
                <div className="col-12 col-md-6 col-xl-4">
                    <figure className="friend-card py-2 px-1 justify-content-center">
                        <img src={defaultAvatar} alt={t("friends.avatar-alt")} />
                        <span>Moritz</span>
                        <input type="button" value={t("friends.delete-friend")} className="delete-button px-2" />
                    </figure>
                </div>
                <div className="col-12 col-md-6 col-xl-4">
                    <figure className="friend-card py-2 px-1justify-content-center">
                        <img src={defaultAvatar} alt={t("friends.avatar-alt")} />
                        <span>Oleksii</span>
                        <input type="button" value={t("friends.delete-friend")} className="delete-button px-2" />
                    </figure>
                </div>
                <div className="col-12 col-md-6 col-xl-4">
                    <figure className="friend-card py-2 px-1 justify-content-center">
                        <img src={defaultAvatar} alt={t("friends.avatar-alt")} />
                        <span>Michelle</span>
                        <input type="button" value={t("friends.delete-friend")} className="delete-button px-2" />
                    </figure>
                </div>
                <div className="col-12 col-md-6 col-xl-4">
                    <figure className="friend-card py-2 px-1 justify-content-center">
                        <img src={defaultAvatar} alt={t("friends.avatar-alt")} />
                        <span>Peter</span>
                        <input type="button" value={t("friends.delete-friend")} className="delete-button px-2 " />
                    </figure>
                </div>
                <div className="col-12 col-md-6 col-xl-4">
                    <figure className="friend-card py-2 px-1 justify-content-center">
                        <img src={defaultAvatar} alt={t("friends.avatar-alt")} />
                        <span>Gwen</span>
                        <input type="button" value={t("friends.delete-friend")} className="delete-button px-2" />
                    </figure>
                </div>
            </div>
            {/* Only appears when button delete is selected */}
            <div className="red-border p-2">
                <div className="form-new-chat p-3 my-2 gap-3 d-flex flex-column justify-content-center align-items-center">
                    <h1>{t("friends.delete-confirm-title", { name: "user" })}</h1>
                    <textarea name="delete-reason" id="delete-reason" className="new-message" placeholder={t("friends.delete-reason-placeholder")}></textarea>
                    <input type="button" value={t("friends.delete")} className="delete-friend-button " />
                </div>
            </div>
            <div className="orange-border p-2">
                <h1>{t("friends.pending-requests")}</h1>
                <div className="row g-4 justify-content-center shortcut-grid">
                    <div className="col-12 col-md-6 col-xl-4">
                        <figure className="friend-card py-2 px-1 justify-content-center">
                            <img src={defaultAvatar} alt={t("friends.avatar-alt")} />
                            <span>John</span>
                            <input type="button" value={t("friends.accept")} className="accept-button" />
                            <input type="button" value={t("friends.refuse")} className="delete-button" />
                        </figure>
                    </div>
                    <div className="col-12 col-md-6 col-xl-4">
                        <figure className="friend-card py-2 px-1 justify-content-center">
                            <img src={defaultAvatar} alt={t("friends.avatar-alt")} />
                            <span>Maxie</span>
                            <input type="button" value={t("friends.accept")} className="accept-button" />
                            <input type="button" value={t("friends.refuse")} className="delete-button" />
                        </figure>
                    </div>
                </div>
            </div>
            <div className="green-border p-2">
                <h1>{t("friends.your-requests")}</h1>
                <div className="row g-4 justify-content-center shortcut-grid">
                    <div className="col-12 col-md-6 col-xl-4">
                        <figure className="friend-card py-2 px-1 justify-content-center">
                            <img src={defaultAvatar} alt={t("friends.avatar-alt")} />
                            <span>Dereck</span>
                            <input type="button" value={t("friends.disable")} className="delete-button" />
                        </figure>
                    </div>
                    <div className="col-12 col-md-6 col-xl-4">
                        <figure className="friend-card py-2 px-1 justify-content-center">
                            <img src={defaultAvatar} alt={t("friends.avatar-alt")} />
                            <span>Duncan</span>
                            <input type="button" value={t("friends.disable")} className="delete-button" />
                        </figure>
                    </div>
                </div>
            </div>

            <AddFriend></AddFriend>

        </div>
    );
}
export default MyFriends;