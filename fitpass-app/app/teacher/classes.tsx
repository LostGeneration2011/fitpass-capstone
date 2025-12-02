import { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getUser } from "../../lib/auth";
import { classesAPI } from "../../lib/api";

export default function TeacherClasses() {
  const navigation = useNavigation();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const user = await getUser();

      if (!user || user.role !== "TEACHER") {
        console.log("❌ Invalid user");
        setClasses([]);
        return;
      }

      const allClasses = await classesAPI.getAll();
      const teacherClasses = Array.isArray(allClasses) 
        ? allClasses.filter((c: any) => c.teacherId === user.id)
        : [];

      console.log("📚 FINAL CLASS RENDER LIST:", teacherClasses);
      setClasses(teacherClasses);
    } catch (err) {
      console.log("❌ Error loading classes:", err);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-950">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-slate-300 mt-4">Loading classes...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-950 p-4">
      <Text className="text-white text-xl font-bold mb-4">My Classes</Text>

      {classes.length === 0 && (
        <View className="bg-slate-800 p-6 rounded-xl border border-slate-700"
             style={{
               shadowColor: '#000',
               shadowOffset: { width: 0, height: 4 },
               shadowOpacity: 0.3,
               shadowRadius: 8,
             }}>
          <Text className="text-slate-300 text-center">📚 You have no classes assigned.</Text>
          <Text className="text-slate-300 text-center mt-2">Contact admin to get classes.</Text>
        </View>
      )}

      {classes.map((c: any) => (
        <View 
          key={c.id}
          className="bg-slate-800 p-4 mb-4 rounded-xl border border-slate-700"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
          }}
        >
          <Text className="text-white text-lg font-semibold">{c.name}</Text>
          <Text className="text-slate-300 mt-1">{c.description}</Text>

          <View className="flex-row justify-between mt-3">
            <View>
              <Text className="text-slate-300 text-sm">👥 Capacity: {c.capacity}</Text>
              <Text className="text-slate-300 text-sm">⏱️ Duration: {c.duration} mins</Text>
            </View>
            <View>
              <Text className="text-slate-300 text-sm">📅 Created: {new Date(c.createdAt).toLocaleDateString()}</Text>
              <Text className="text-green-400 text-sm font-medium">✅ Students: {c._count?.enrollments ?? 0}</Text>
            </View>
          </View>

          <TouchableOpacity 
            className="bg-blue-600 p-3 rounded-lg mt-3"
            style={{
              shadowColor: '#3b82f6',
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.3,
              shadowRadius: 6,
            }}
            onPress={() => {
              try {
                (navigation as any).navigate('Sessions', {
                  classId: c.id,
                  className: c.name,
                });
              } catch (error) {
                console.log("Navigation error:", error);
              }
            }}
          >
            <Text className="text-white text-center font-semibold">View Sessions</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}