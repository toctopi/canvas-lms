(function(){define(["i18n!section","underscore","compiled/str/underscore"],function(a,b,c){var d;return d={limited:{TeacherEnrollment:a.t("enrolled_as_limited_teacher","enrolled as a teacher with section-only access"),TaEnrollment:a.t("enrolled_as_limited_ta","enrolled as a TA with section-only access"),ObserverEnrollment:a.t("enrolled_as_limited_observer","enrolled as a observer with section-only access"),CourseDesignerEnrollment:a.t("enrolled_as_limited_designer","enrolled as a designer with section-only access"),StudentEnrollment:a.t("enrolled_as_limited_student","enrolled as a student with section-only access")},standard:{TeacherEnrollment:a.t("enrolled_as_teacher","enrolled as a teacher"),TaEnrollment:a.t("enrolled_as_ta","enrolled as a TA"),ObserverEnrollment:a.t("enrolled_as_observer","enrolled as a observer"),CourseDesignerEnrollment:a.t("enrolled_as_designer","enrolled as a designer"),StudentEnrollment:a.t("enrolled_as_student","enrolled as a student")}},function(a){return b.map(a,function(a){var b;return b=a.limit_privileges_to_course_section?"limited":"standard",a.typeLabel=d[b][a.type],a.permissions=ENV.PERMISSIONS,a.typeClass=c(a.type),a})}})}).call(this)