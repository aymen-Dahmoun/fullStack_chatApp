import { KeyboardAvoidingView, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavBar from "./NavBar";


export default function MainLayout({children}){

    return(
        <SafeAreaView className="flex-1 bg-white dark:bg-neutral-900">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                className="flex-1 bg-slate-400"
            >
                {children}
                <NavBar />
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}