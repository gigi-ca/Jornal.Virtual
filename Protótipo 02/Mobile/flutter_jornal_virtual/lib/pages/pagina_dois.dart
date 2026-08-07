import 'package:flutter/material.dart';

class PaginaDois extends StatefulWidget {
  const PaginaDois({super.key});

  @override
  State<PaginaDois> createState() => _PaginaDoisState();
}

class _PaginaDoisState extends State<PaginaDois> {
  double progresso = 0.5;
  String cargo = "Professor";

  final TextEditingController controller = TextEditingController();

  double _scaleGostei = 1.0;
  double _scaleNaoGostei = 1.0;

  static const rosa = Color(0xFFD92C67);
  static const vinho = Color(0xFF7A1438);
  static const bege = Color(0xFFDDCFB7);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFEFEFEF),

      bottomNavigationBar: Container(
        height: 65, 
        color: const Color(0xFFD91B65), 
        child: Row(
          children: [
            Expanded(
              child: IconButton(
                icon: const Icon(Icons.home, color: Colors.white, size: 30),
                onPressed: () {
                  Navigator.popUntil(context, (route) => route.isFirst);
                },
              ),
            ),
            Expanded(
              child: Center(
                child: Container(
                  width: 50,
                  height: 50,
                  decoration: const BoxDecoration(
                    color: Colors.white,
                    shape: BoxShape.circle,
                  ),
                  child: const IconButton(
                    icon: Icon(Icons.menu, color: Colors.black, size: 30),
                    onPressed: null, 
                  ),
                ),
              ),
            ),
            Expanded(
              child: IconButton(
                icon: const Icon(Icons.account_circle, color: Colors.white, size: 32),
                onPressed: () {},
              ),
            ),
            Expanded(
              child: IconButton(
                icon: const Icon(Icons.settings, color: Colors.white, size: 30),
                onPressed: () {},
              ),
            ),
          ],
        ),
      ),

      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            children: [
              Container(
                height: 55,
                color: const Color(0xFFF04D82),
                child: Row(
                  children: [
                    const SizedBox(width: 10),
                    InkWell(
                      onTap: () {
                        Navigator.pop(context);
                      },
                      child: Container(
                        width: 35,
                        height: 35,
                        decoration: const BoxDecoration(
                          color: rosa,
                          shape: BoxShape.circle,
                          boxShadow: [
                            BoxShadow(
                              blurRadius: 5,
                              color: Colors.black26,
                            )
                          ],
                        ),
                        child: const Icon(
                          Icons.undo,
                          color: Colors.black,
                          size: 20,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 10),

              const Text(
                "Mural de Hashtag",
                style: TextStyle(
                  fontFamily: "CrimsonPro",
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: vinho,
                  shadows: [
                    Shadow(
                      blurRadius: 4,
                      color: Colors.black26,
                      offset: Offset(2, 2),
                    )
                  ],
                ),
              ),

              const SizedBox(height: 15),

              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Wrap(
                  alignment: WrapAlignment.center,
                  spacing: 10,
                  runSpacing: 8,
                  children: const [
                    Text("halloween", style: TextStyle(color: Colors.red)),
                    Text("diversão", style: TextStyle(color: Colors.pink)),
                    Text("inovação", style: TextStyle(color: Colors.red)),
                    Text("metas", style: TextStyle(color: Colors.pink)),
                    Text(
                      "interclasse",
                      style: TextStyle(
                        color: rosa,
                        fontSize: 48,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      "Olimpíadas",
                      style: TextStyle(
                        color: vinho,
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      "Competição",
                      style: TextStyle(
                        color: vinho,
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 25),

              Container(
                margin: const EdgeInsets.symmetric(horizontal: 25),
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: bege,
                  borderRadius: BorderRadius.circular(30),
                ),
                child: Column(
                  children: [
                    Container(
                      width: 70,
                      height: 70,
                      decoration: const BoxDecoration(
                        color: rosa,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.chat_bubble_outline,
                        color: Colors.white,
                        size: 35,
                      ),
                    ),

                    Container(
                      margin: const EdgeInsets.only(top: 10),
                      padding: const EdgeInsets.all(18),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(25),
                      ),
                      child: Column(
                        children: [
                          const Text(
                            "Qual sua opinião sobre as novas Hashtags?",
                            style: TextStyle(
                              fontFamily: "CrimsonPro",
                              color: rosa,
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),

                          const SizedBox(height: 15),

                          Container(
                            width: 240,
                            height: 28,
                            decoration: BoxDecoration(
                              color: bege,
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Align(
                              alignment: Alignment.centerLeft,
                              child: AnimatedContainer(
                                duration: const Duration(milliseconds: 300),
                                width: 240 * progresso,
                                decoration: BoxDecoration(
                                  color: rosa,
                                  borderRadius: BorderRadius.circular(20),
                                ),
                              ),
                            ),
                          ),

                          const SizedBox(height: 15),

                          Row(
                            children: [
                              Expanded(
                                child: AnimatedScale(
                                  scale: _scaleGostei,
                                  duration: const Duration(milliseconds: 100),
                                  curve: Curves.easeOutBack,
                                  child: GestureDetector(
                                    onTap: () {
                                      setState(() {
                                        progresso = 1.0;
                                        _scaleGostei = 1.15;
                                      });
                                      Future.delayed(const Duration(milliseconds: 100), () {
                                        setState(() { _scaleGostei = 1.0; });
                                      });
                                    },
                                    child: AnimatedContainer(
                                      duration: const Duration(milliseconds: 200),
                                      height: 40,
                                      decoration: BoxDecoration(
                                        color: progresso == 1.0 ? vinho : rosa,
                                        borderRadius: BorderRadius.circular(20),
                                        boxShadow: const [
                                          BoxShadow(color: Colors.black12, blurRadius: 4, offset: Offset(0, 2))
                                        ],
                                      ),
                                      child: Center(
                                        child: Text(
                                          "Gostei",
                                          style: TextStyle(
                                            color: progresso == 1.0 ? Colors.white : Colors.black,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 10),
                              
                              Expanded(
                                child: AnimatedScale(
                                  scale: _scaleNaoGostei,
                                  duration: const Duration(milliseconds: 100),
                                  curve: Curves.easeOutBack,
                                  child: GestureDetector(
                                    onTap: () {
                                      setState(() {
                                        progresso = 0.2;
                                        _scaleNaoGostei = 1.15;
                                      });
                                      Future.delayed(const Duration(milliseconds: 100), () {
                                        setState(() { _scaleNaoGostei = 1.0; });
                                      });
                                    },
                                    child: AnimatedContainer(
                                      duration: const Duration(milliseconds: 200),
                                      height: 40,
                                      decoration: BoxDecoration(
                                        color: progresso == 0.2 ? vinho : rosa,
                                        borderRadius: BorderRadius.circular(20),
                                        boxShadow: const [
                                          BoxShadow(color: Colors.black12, blurRadius: 4, offset: Offset(0, 2))
                                        ],
                                      ),
                                      child: Center(
                                        child: Text(
                                          "Não Gostei",
                                          style: TextStyle(
                                            color: progresso == 0.2 ? Colors.white : Colors.black,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          )
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 15),

              const Text(
                "Criar uma hashtag",
                style: TextStyle(
                  fontFamily: "CrimsonPro",
                  color: vinho,
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                ),
              ),

              const SizedBox(height: 15),

              Container(
                margin: const EdgeInsets.symmetric(horizontal: 25),
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: bege,
                  borderRadius: BorderRadius.circular(35),
                ),
                child: Column(
                  children: [
                    Row(
                      children: [
                        const CircleAvatar(
                          radius: 20,
                          backgroundImage: AssetImage(
                            "/imgs/rosangela.jpeg",
                          ),
                        ),
                        const SizedBox(width: 10),
                        const Expanded(
                          child: Text(
                            "ROSÂNGELA NORIS",
                            style: TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        DropdownButton<String>(
                          value: cargo,
                          items: const [
                            DropdownMenuItem(
                              value: "Professor",
                              child: Text("Professor"),
                            ),
                            DropdownMenuItem(
                              value: "Administrador",
                              child: Text("Administrador"),
                            ),
                            DropdownMenuItem(
                              value: "Diretora",
                              child: Text("Diretora"),
                            ),
                            DropdownMenuItem(
                              value: "Coordenadora",
                              child: Text("Coordenadora"),
                            ),
                          ],
                          onChanged: (value) {
                            setState(() {
                              cargo = value!;
                            });
                          },
                        )
                      ],
                    ),

                    const SizedBox(height: 15),

                    TextField(
                      controller: controller,
                      maxLines: 4,
                      decoration: const InputDecoration(
                        border: InputBorder.none,
                        hintText: "Qual a sua ideia,\nRosângela?",
                        hintStyle: TextStyle(
                          fontFamily: "CrimsonPro",
                          fontSize: 24,
                        ),
                      ),
                    ),

                    Align(
                      alignment: Alignment.centerRight,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFE8B2AA),
                        ),
                        onPressed: () {},
                        child: const Text(
                          "Postar",
                          style: TextStyle(color: Colors.black),
                        ),
                      ),
                    )
                  ],
                ),
              ),

              const SizedBox(height: 18),

              Row(
                children: [
                  Expanded(
                    child: cardInferior(
                      Icons.edit_note,
                      "Propor Tema",
                    ),
                  ),
                  Expanded(
                    child: cardInferior(
                      Icons.send,
                      "Enviar Artigo",
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 25),
            ],
          ),
        ),
      ),
    );
  }

  Widget cardInferior(IconData icon, String texto) {
    return Container(
      height: 140,
      margin: const EdgeInsets.symmetric(horizontal: 8),
      decoration: BoxDecoration(
        color: vinho,
        borderRadius: BorderRadius.circular(30),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            icon,
            color: Colors.white,
            size: 45,
          ),
          const SizedBox(height: 15),
          Text(
            texto,
            style: const TextStyle(
              color: Colors.white,
              fontFamily: "CrimsonPro",
              fontSize: 18,
            ),
          ),
        ],
      ),
    );
  }
}