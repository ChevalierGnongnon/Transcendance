import "../../scss/common-classes.scss";
import "../../scss/messages.scss"
import { useTranslation } from "react-i18next";
import { useState } from "react";
import defaultAvatar from "../../../public/default-avatar.png"
import MoreOptions from "./options"
function ChatRoom() {
    const { t } = useTranslation();
    const [showMoreOptions, setShowMoreOptions] = useState(false);

    return (
        <>


            <div className="chat-list chat-list-right my-2">
                <div className="chat-header">
                    {t('common.chatting-with')}
                </div>
                <ul className="px-3">
                    <li className="d-flex justify-content-start">
                        <figure className="avatar-msg"><img src={defaultAvatar} alt="avatar" /></figure>
                        <div className="message-left card p-3 m-2">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum ab voluptate incidunt.
                            Nam neque alias officia optio quibusdam aut, harum debitis suscipit dignissimos at nihil ex commodi,
                            quidem, rerum amet.
                        </div>
                    </li>
                    <li className="d-flex justify-content-end">
                        <div className="message-right card p-3 m-2">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            Inventore obcaecati ullam labore beatae illo, dolorem repellat
                            fugiat ducimus quasi eos quaerat perspiciatis explicabo animi,
                            iste maiores dolor repellendus totam impedit!
                        </div>
                        <figure className="avatar-msg"><img src={defaultAvatar} alt="avatar" /></figure>
                    </li>
                    <li className="d-flex justify-content-start">
                        <figure className="avatar-msg"><img src={defaultAvatar} alt="avatar" /></figure>
                        <div className="message-left card p-3 m-2">
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                            Accusantium qui labore voluptas quibusdam voluptatum,
                            consectetur distinctio repudiandae obcaecati eaque quod et perspiciatis officiis,
                            at commodi, eos enim itaque quia sint!
                        </div>
                        
                    </li>
                    <li className="d-flex justify-content-end">
                        <div className="message-right card p-3 m-2">
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                            Ratione voluptatibus veritatis suscipit esse laudantium voluptatem,
                            ipsa laboriosam vel libero hic, nihil at magni mollitia,
                            quasi aspernatur ea tempora enim. Ex?
                        </div>
                        <figure className="avatar-msg"><img src={defaultAvatar} alt="avatar" /></figure>
                    </li>
                    <li className="d-flex justify-content-start">
                        <figure className="avatar-msg"><img src={defaultAvatar} alt="avatar" /></figure>
                        <div className="message-left card p-3 m-2">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                            Magni blanditiis cumque explicabo nobis dignissimos non?
                            Necessitatibus perspiciatis mollitia dignissimos repellat,
                            dicta soluta odit voluptates consequuntur, a totam deserunt,
                            perferendis temporibus!
                        </div>
                    </li>
                    <li className="d-flex justify-content-start">
                        <figure className="avatar-msg"><img src={defaultAvatar} alt="avatar" /></figure>
                        <div className="message-left card p-3 m-2">
                            ?
                        </div>
                    </li>

                    <li className="d-flex justify-content-end">
                        <div className="message-right card p-3 m-2">
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                            Ratione voluptatibus veritatis suscipit esse laudantium voluptatem,
                            ipsa laboriosam vel libero hic, nihil at magni mollitia,
                            quasi aspernatur ea tempora enim. Ex?
                        </div>
                        <figure className="avatar-msg"><img src={defaultAvatar} alt="avatar" /></figure>
                    </li>
                    <li className="d-flex justify-content-end">
                        <div className="message-right card p-3 m-2">
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                            Ratione voluptatibus veritatis suscipit esse laudantium voluptatem,
                            ipsa laboriosam vel libero hic, nihil at magni mollitia,
                            quasi aspernatur ea tempora enim. Ex?
                        </div>
                        <figure className="avatar-msg"><img src={defaultAvatar} alt="avatar" /></figure>
                    </li><li className="d-flex justify-content-end">
                        <div className="message-right card p-3 m-2">
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                            Ratione voluptatibus veritatis suscipit esse laudantium voluptatem,
                            ipsa laboriosam vel libero hic, nihil at magni mollitia,
                            quasi aspernatur ea tempora enim. Ex?
                        </div>
                        <figure className="avatar-msg"><img src={defaultAvatar} alt="avatar" /></figure>
                    </li>

                </ul>
                <div className="input-group group-new-message my-3">
                    <div className="position-relative">
                        <button
                            className="btn fs-2 send-message d-flex align-items-center justify-content-center"
                            onClick={() => setShowMoreOptions(prev => !prev)}
                        >
                            +
                        </button>
                        {showMoreOptions && <MoreOptions></MoreOptions>}
                    </div>
                    <textarea className="form-control message-area" name="new-message" placeholder="Type your message here"></textarea>
                    <button className="btn send-message">{t('common.send')}</button>
                </div>
            </div>


        </>
    )
}

export default ChatRoom;