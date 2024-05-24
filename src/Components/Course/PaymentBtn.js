import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer
} from "@paypal/react-paypal-js";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";

// This value is from the props in the UI
const style = { "layout": "vertical" };

export default function App(props) {
    const { currentUser } = useContext(AuthContext);
    const course = props.course;
    const idRoadMap = props.idRoadMap;
    const price = props.price;
    const navigate = useNavigate();
    console.log(price);
    const handleApply = async () => {
        try {
            const docSnap = await getDoc(doc(db, "users", currentUser.uid));
            const idUser = docSnap.data().id;
            const docListCourseUser = await getDocs(collection(db, "listCourseUser"));
            const sz = docListCourseUser.size + 1;
            const id = "" + sz;
            try {
                await setDoc(doc(db, "listCourseUser", id), {
                    id: id,
                    IdUser: idUser,
                    IdCourse: course.id
                });
                const numberUser = course.userAplly === undefined ? 1 : course.userAplly + 1;
                await updateDoc(doc(db, "course", course.id), {
                    userAplly: numberUser
                })
                console.log("Document successfully written!");
            } catch (e) {
                console.error("Error writing document: ", e);
            }
            const dt = [];
            const q = query(collection(db, "active"), where("idRoadMap", "==", idRoadMap));
            const rm = await getDocs(q);
            await Promise.all(rm.docs.map(async (it) => {
                dt.push(it.data());
            }));
            if(dt.length<=0)
            {
                alert("Khóa học chưa có hoạt động");
            }
            else
            {
                const dt1=dt.sort((a,b)=>a.timeCreate-b.timeCreate);
                const idActive = dt1[0].id;
                //console.table(dt1);
                navigate(`/learing/${idActive}/${course.id}`);
            }
        } catch (error) {
            console.log(error);
        }
    }
    const onCreateOrder = (data,actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: price,
                    },
                },
            ],
        });
    }
    const onApproveOrder = (data,actions) => {
        return actions.order.capture().then((details) => {
        const name = details.payer.name.given_name;
            handleApply();
            alert(`Cảm ơn ${name} đã mua khóa học chúc bạn có những giờ học vui vẻ`);
        });
      }
    // Custom component to wrap the PayPalButtons and show loading spinner
    const ButtonWrapper = ({ showSpinner }) => {
        const [{ isPending }] = usePayPalScriptReducer();

        return (
            <>
                {(showSpinner && isPending) && <div className="spinner" />}
                <PayPalButtons
                    amount="10.0" // Đặt giá trị amount trực tiếp
                    style={style}
                    disabled={false}
                    forceReRender={[style]}
                    fundingSource={undefined}
                    createOrder={(data, actions) => onCreateOrder(data, actions)}
                    onApprove={(data, actions) => onApproveOrder(data, actions)}
                />

            </>
        );
    }

    return (
        <div style={{ maxWidth: "750px", minHeight: "200px" }}>
            <PayPalScriptProvider options={{ clientId: "test", components: "buttons", currency: "USD" }}>
                <ButtonWrapper showSpinner={false} />
            </PayPalScriptProvider>
        </div>
    );
}