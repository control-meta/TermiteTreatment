export const serviceBenefits: Record<string, [string, string][]> = {
  'pre-construction-termite-treatment': [
      ["Foundation Protection", "Treat exposed foundation soil before building work covers these important access points."],
      ["Under-floor Protection", "Plan soil treatment beneath floors while the plinth filling remains fully accessible."],
      ["Preventive Approach", "Include termite prevention in your construction schedule before the building takes shape."],
      ["Entry-Point Attention", "Identify pipe routes and service junctions that need attention during planned treatment."],
      ["Suitable for All Projects", "Discuss soil treatment for homes, apartments, offices and other planned building projects."],
      ["Planned Application", "Coordinate treatment visits with your builder around the relevant stages of construction."],
    ],
  'residential-termite-control': [
      ["Early identification", "Have suspicious termite signs assessed through a careful inspection of accessible areas."],
      ["Timber attention", "Check doors, frames, cabinets and skirting for visible damage or termite activity."],
      ["Targeted treatment", "Focus treatment on accessible areas identified during a careful inspection of activity."],
      ["A plan for your home", "Consider your home's layout, access and daily routine when planning treatment visits."],
      ["Clear preparation", "Understand the preparation, access and re-entry instructions for your agreed treatment visit."],
      ["Practical aftercare", "Understand which signs to monitor and when to arrange follow-up after treatment."],
    ],
  'commercial-termite-control': [
      ["Premises assessment", "Review accessible timber, building junctions and areas of concern across your premises."],
      ["Timber protection", "Inspect fittings, fixtures and joinery to identify visible signs of termite activity."],
      ["Flexible planning", "Discuss suitable inspection and treatment timings around your staff and business operations."],
      ["Site-specific scope", "Match treatment plans to your building layout, access requirements and daily operations."],
      ["Service records", "Keep inspection notes, agreed treatment areas and visit details organised together clearly."],
      ["Continuing care", "Discuss follow-up inspections and maintenance options suited to your premises and needs."],
    ],
  'post-construction-termite-treatment': [
      ["Find the activity", "Inspect visible termite signs and accessible timber to understand the current activity."],
      ["Address entry routes", "Review accessible floor and wall junctions to identify possible termite entry routes."],
      ["Targeted application", "Select suitable treatment methods for the affected areas identified during your inspection."],
      ["Existing-building care", "Plan treatment access around existing finishes, occupied rooms and your daily routine."],
      ["Clear scope of work", "Understand the proposed treatment method, preparation and agreed areas before work begins."],
      ["Aftercare guidance", "Understand aftercare guidance and which changes may need attention following your treatment."],
    ],
  'annual-maintenance-contract': [
      ["Scheduled inspections", "Arrange regular inspection visits around your property access and agreed service schedule."],
      ["Continuing attention", "Monitor areas of previous concern and discuss new signs between scheduled visits."],
      ["A property-specific plan", "Agree inspection areas, visit frequency and treatment inclusions before your plan begins."],
      ["Clear service records", "Keep inspection notes, visit details and agreed service records organised together clearly."],
      ["Prevention guidance", "Discuss moisture, maintenance and property conditions that may need attention between visits."],
      ["Defined support", "Understand your agreed plan, included care and support available between scheduled visits."],
    ],
};

export const benefitDescriptions = Object.values(serviceBenefits).flatMap(items => items.map(([, description]) => description));
